# Production Deployment Guide

This guide covers deploying the Audience Engagement Platform to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Building for Production](#building-for-production)
4. [Deployment Options](#deployment-options)
5. [Database Setup](#database-setup)
6. [Scaling Considerations](#scaling-considerations)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Security Checklist](#security-checklist)

---

## Prerequisites

Before deploying to production, ensure you have:

- Node.js 20+ LTS
- PostgreSQL 15+ database
- Redis 7+ (for session storage and pub/sub)
- Domain name with SSL certificate
- CI/CD pipeline (GitHub Actions recommended)

---

## Environment Configuration

### Backend Environment Variables

Create a `.env` file for production:

```bash
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Redis
REDIS_URL=redis://user:password@host:6379

# CORS (your frontend domain)
CORS_ORIGIN=https://yourdomain.com

# Session
SESSION_SECRET=generate-a-secure-random-string-at-least-32-characters
```

### Frontend Environment Variables

Create a `.env.production` file:

```bash
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=https://api.yourdomain.com
```

### Generating Secure Secrets

```bash
# Generate a secure session secret
openssl rand -base64 32
```

---

## Building for Production

### Frontend Build

```bash
cd frontend
npm install
npm run build
```

This creates a `dist/` folder with static files ready for deployment.

### Backend Build

```bash
cd backend
npm install
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### Full Production Build

From the root directory:

```bash
npm install
npm run build
```

---

## Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Create Production Dockerfile for Frontend

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Create Production Dockerfile for Backend

```dockerfile
# backend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

#### Production Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - CORS_ORIGIN=${CORS_ORIGIN}
      - SESSION_SECRET=${SESSION_SECRET}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  postgres_data:
  redis_data:
```

### Option 2: Railway Deployment

Railway offers easy PostgreSQL and Redis add-ons.

1. **Create a Railway project**:
   ```bash
   railway init
   ```

2. **Add PostgreSQL and Redis**:
   - Go to Railway dashboard
   - Add PostgreSQL and Redis plugins

3. **Deploy backend**:
   ```bash
   cd backend
   railway up
   ```

4. **Deploy frontend** (to Vercel/Netlify):
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `frontend/dist`

### Option 3: Render Deployment

1. **Create render.yaml**:

```yaml
# render.yaml
services:
  - type: web
    name: audience-engagement-api
    env: node
    buildCommand: cd backend && npm install && npm run build
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: audience-engagement-db
          property: connectionString
      - key: REDIS_URL
        fromService:
          name: audience-engagement-redis
          type: redis
          property: connectionString

  - type: web
    name: audience-engagement-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html

databases:
  - name: audience-engagement-db
    databaseName: audience_engagement
    user: postgres
```

### Option 4: Fly.io Deployment

1. **Create fly.toml for backend**:

```toml
# backend/fly.toml
app = "audience-engagement-api"
primary_region = "iad"

[build]
  builder = "heroku/buildpacks:20"

[env]
  NODE_ENV = "production"
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true

[[services]]
  protocol = "tcp"
  internal_port = 8080

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```

2. **Deploy**:
   ```bash
   fly launch
   fly deploy
   ```

---

## Database Setup

### Running Migrations in Production

```bash
# Set DATABASE_URL environment variable
export DATABASE_URL=postgresql://user:password@host:5432/database

# Run migrations
cd backend
npm run migrate
```

### Database Backups

Set up automated backups using your hosting provider's tools or:

```bash
# Manual backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
psql $DATABASE_URL < backup_file.sql
```

### Connection Pooling

For production with many concurrent users, use connection pooling:

```bash
# Use pgBouncer or PgPool
# Or managed pooling from providers like Supabase, Neon
DATABASE_URL=postgresql://user:password@pooler.host:6543/database?pgbouncer=true
```

---

## Scaling Considerations

### Horizontal Scaling

For 200+ concurrent users:

1. **Load Balancer**: Use nginx or cloud load balancer
2. **Multiple Backend Instances**: Run 2-3 instances
3. **Sticky Sessions**: Use Redis for session storage
4. **WebSocket Scaling**: Use Redis Pub/Sub adapter

#### nginx Load Balancer Configuration

```nginx
upstream backend {
    ip_hash;  # Sticky sessions
    server backend1:3000;
    server backend2:3000;
    server backend3:3000;
}

server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Redis Adapter for Socket.IO

Update backend to use Redis adapter for multi-instance WebSocket support:

```typescript
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'

const pubClient = createClient({ url: process.env.REDIS_URL })
const subClient = pubClient.duplicate()

await Promise.all([pubClient.connect(), subClient.connect()])

io.adapter(createAdapter(pubClient, subClient))
```

### Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX CONCURRENTLY idx_questions_session_status ON questions(session_id, status);
CREATE INDEX CONCURRENTLY idx_questions_votes_desc ON questions(votes DESC);
CREATE INDEX CONCURRENTLY idx_polls_session_active ON polls(session_id) WHERE status = 'active';
```

---

## Monitoring & Maintenance

### Error Tracking (Sentry)

1. Install Sentry:
   ```bash
   npm install @sentry/node --workspace=backend
   npm install @sentry/react --workspace=frontend
   ```

2. Initialize in backend:
   ```typescript
   import * as Sentry from '@sentry/node'

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
   })
   ```

### Health Checks

The backend includes a health check endpoint:

```bash
curl https://api.yourdomain.com/health
# Response: {"status":"ok","timestamp":"2025-01-01T00:00:00.000Z"}
```

### Logging

Use structured logging for production:

```typescript
// Use a logging library like pino or winston
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty' }
    : undefined
})
```

### Performance Monitoring

- **PostHog** or **Plausible**: Analytics
- **Grafana + Prometheus**: Metrics dashboards
- **Uptime Robot**: Availability monitoring

---

## Security Checklist

### Before Going Live

- [ ] **HTTPS Only**: Ensure all traffic uses SSL/TLS
- [ ] **Environment Variables**: No secrets in code
- [ ] **CORS**: Restrict to your domain only
- [ ] **Rate Limiting**: Implement request limits
- [ ] **Input Validation**: Sanitize all user input
- [ ] **SQL Injection**: Use parameterized queries (already implemented)
- [ ] **XSS Prevention**: Sanitize output (React handles this)
- [ ] **CSRF Protection**: Use tokens for state-changing requests
- [ ] **Security Headers**: Add Helmet middleware

### Add Helmet for Security Headers

```typescript
import helmet from 'helmet'

app.use(helmet())
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
})

app.use('/api/', limiter)
```

### WebSocket Rate Limiting

```typescript
const userMessageCount = new Map<string, number>()

io.use((socket, next) => {
  const userId = socket.data.userId
  const count = userMessageCount.get(userId) || 0

  if (count > 100) {
    return next(new Error('Rate limit exceeded'))
  }

  userMessageCount.set(userId, count + 1)
  next()
})
```

---

## Cost Estimation

### Small Scale (50-100 users)
- **Hosting**: ~$20-30/month
- **Database**: ~$15/month (managed PostgreSQL)
- **Redis**: ~$10/month
- **Total**: ~$45-55/month

### Medium Scale (200-500 users)
- **Hosting**: ~$50-80/month (multiple instances)
- **Database**: ~$30-50/month (larger instance + backups)
- **Redis**: ~$15-20/month
- **CDN**: ~$10/month
- **Total**: ~$105-160/month

### Large Scale (1000+ users)
- **Auto-scaling cluster**: ~$200-400/month
- **Database**: ~$100-200/month (with replicas)
- **Redis cluster**: ~$50-100/month
- **CDN + DDoS protection**: ~$50/month
- **Total**: ~$400-750/month

---

## Troubleshooting

### Common Issues

#### WebSocket Connection Fails
- Check CORS settings
- Ensure proxy is configured for WebSocket upgrade
- Verify SSL certificate for wss://

#### Database Connection Issues
- Check connection string format
- Verify SSL mode (sslmode=require for most providers)
- Check connection limits

#### High Memory Usage
- Monitor for memory leaks
- Set appropriate Node.js heap size
- Implement connection pooling

### Getting Help

1. Check logs: `docker logs <container>`
2. Health check: `curl /health`
3. Database connection: `psql $DATABASE_URL -c "SELECT 1"`
4. Redis connection: `redis-cli -u $REDIS_URL ping`

---

## Quick Deployment Checklist

- [ ] Set up production database (PostgreSQL)
- [ ] Set up Redis instance
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Build frontend and backend
- [ ] Configure domain and SSL
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Configure backups
- [ ] Test all features
- [ ] Set up CI/CD pipeline
- [ ] Monitor first few sessions

---

**Happy deploying! 🚀**

For questions or issues, refer to the [SETUP.md](./SETUP.md) for local development or create an issue in the repository.
