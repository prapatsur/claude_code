# Setup Guide - Audience Engagement Platform

This guide will help you set up the development environment and run the application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20+ and **npm** 10+ ([Download](https://nodejs.org/))
- **Docker** and **Docker Compose** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/))

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd claude_code
```

### 2. Install Dependencies

Install all dependencies for the monorepo (frontend, backend, and shared):

```bash
npm install
```

This will install dependencies for all workspaces.

### 3. Start Database Services

Start PostgreSQL and Redis using Docker Compose:

```bash
npm run docker:up
```

This will start:
- **PostgreSQL** on port 5432
- **Redis** on port 6379

Verify services are running:
```bash
docker ps
```

You should see two containers:
- `audience-engagement-db` (PostgreSQL)
- `audience-engagement-redis` (Redis)

### 4. Set Up Environment Variables

#### Backend

```bash
cd backend
cp .env.example .env
```

The default `.env` file should work with the Docker setup. It contains:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/audience_engagement
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:5173
SESSION_SECRET=your-secret-key-change-in-production
```

#### Frontend

```bash
cd ../frontend
cp .env.example .env
```

Default frontend `.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
```

### 5. Run Database Migrations

Create the database schema:

```bash
cd ../backend
npm run migrate
```

You should see:
```
🔄 Running database migrations...
✅ Database migrations completed successfully
```

### 6. Start Development Servers

From the root directory, start both frontend and backend:

```bash
cd ..
npm run dev
```

This will concurrently start:
- **Frontend** (Vite dev server) on http://localhost:5173
- **Backend** (Node.js + WebSocket) on http://localhost:3000

You should see output like:
```
[backend] 🚀 Server running on port 3000
[backend] 📡 WebSocket server ready
[backend] ✅ Connected to PostgreSQL database
[frontend] VITE v5.0.8  ready in 350 ms
[frontend] ➜  Local:   http://localhost:5173/
```

### 7. Open the Application

Navigate to http://localhost:5173 in your browser.

You should see the home page with a form to join a session.

## Creating Your First Session

Since there's no organizer interface yet, you can create a session using the API:

```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Session",
    "description": "My first test session",
    "settings": {
      "moderation_enabled": false,
      "allow_anonymous": true
    }
  }'
```

This will return a JSON response with a `code` field (e.g., `"code": "ABC12345"`).

Use this code to join the session at http://localhost:5173

## Development Workflow

### Running Individual Services

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Database Management

```bash
# View database logs
npm run docker:logs

# Stop database services
npm run docker:down

# Restart database services
npm run docker:down && npm run docker:up
```

### Connecting to PostgreSQL

Using `psql`:
```bash
psql postgresql://postgres:postgres@localhost:5432/audience_engagement
```

Using GUI tools (e.g., DBeaver, pgAdmin):
- Host: `localhost`
- Port: `5432`
- Database: `audience_engagement`
- Username: `postgres`
- Password: `postgres`

### Connecting to Redis

Using `redis-cli`:
```bash
docker exec -it audience-engagement-redis redis-cli
```

## Project Structure

```
claude_code/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (routes)
│   │   ├── services/        # API and WebSocket services
│   │   ├── hooks/           # Custom React hooks
│   │   ├── stores/          # State management (Zustand)
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── routes/          # Express routes
│   │   ├── services/        # Business logic
│   │   ├── socket/          # WebSocket handlers
│   │   ├── db/              # Database connection and migrations
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── .env.example
│   └── package.json
│
├── shared/                  # Shared code between frontend/backend
│   └── types/               # Shared TypeScript types
│
├── docker-compose.yml       # Database services
├── package.json             # Root package.json (monorepo)
├── PRD.md                   # Product Requirements Document
├── CLAUDE.md                # AI assistant documentation
└── README.md                # Project overview
```

## API Endpoints

### Sessions

- `POST /api/sessions` - Create a new session
- `GET /api/sessions/code/:code` - Get session by code
- `GET /api/sessions/:id` - Get session by ID
- `PATCH /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

### Questions

- `GET /api/questions/session/:sessionId` - Get questions for a session
- `POST /api/questions` - Submit a question
- `POST /api/questions/:questionId/vote` - Vote on a question
- `DELETE /api/questions/:questionId/vote` - Unvote on a question
- `PATCH /api/questions/:questionId` - Update question (moderation)
- `DELETE /api/questions/:questionId` - Delete question

### Polls

- `GET /api/polls/session/:sessionId` - Get polls for a session
- `POST /api/polls` - Create a poll
- `PATCH /api/polls/:pollId` - Update poll
- `POST /api/polls/:pollId/responses` - Submit poll response
- `GET /api/polls/:pollId/results` - Get poll results
- `DELETE /api/polls/:pollId` - Delete poll

## WebSocket Events

### Client to Server

- `session:join` - Join a session
- `question:submit` - Submit a question
- `question:vote` - Vote on a question
- `question:unvote` - Unvote on a question
- `poll:respond` - Respond to a poll

### Server to Client

- `session:joined` - Confirmation of session join
- `session:update` - Session data updated
- `question:new` - New question submitted
- `question:update` - Question updated (votes, status, etc.)
- `question:delete` - Question deleted
- `poll:new` - New poll created
- `poll:update` - Poll updated
- `error` - Error message

## Troubleshooting

### Database Connection Issues

If you see `ECONNREFUSED` errors:

1. Verify Docker containers are running:
   ```bash
   docker ps
   ```

2. Check database logs:
   ```bash
   npm run docker:logs
   ```

3. Restart database services:
   ```bash
   npm run docker:down
   npm run docker:up
   ```

### Port Already in Use

If ports 3000, 5173, 5432, or 6379 are already in use:

**Option 1**: Stop the conflicting service

**Option 2**: Change ports in configuration files:
- Frontend: `vite.config.ts` (default 5173)
- Backend: `.env` `PORT` variable (default 3000)
- PostgreSQL: `docker-compose.yml` (default 5432)
- Redis: `docker-compose.yml` (default 6379)

### WebSocket Connection Failed

1. Verify backend is running on port 3000
2. Check CORS settings in `backend/src/index.ts`
3. Ensure `VITE_WS_URL` in frontend `.env` matches backend URL
4. Check browser console for detailed error messages

### Database Migration Errors

If migration fails:

1. Drop the database and recreate:
   ```bash
   npm run docker:down
   docker volume rm claude_code_postgres_data
   npm run docker:up
   npm run migrate --workspace=backend
   ```

## Next Steps

Now that you have the development environment set up, you can:

1. **Create a session** using the API (see above)
2. **Join the session** in your browser at http://localhost:5173
3. **Test Q&A functionality** by submitting questions
4. **Explore the codebase** to understand the architecture
5. **Start implementing features** from the PRD

## Additional Commands

```bash
# Type checking
npm run type-check              # All workspaces
npm run type-check --workspace=frontend
npm run type-check --workspace=backend

# Linting
npm run lint                    # All workspaces
npm run lint --workspace=frontend
npm run lint --workspace=backend

# Build for production
npm run build                   # All workspaces
npm run build:frontend          # Frontend only
npm run build:backend           # Backend only
```

## Resources

- [PRD.md](./PRD.md) - Product requirements and features
- [CLAUDE.md](./CLAUDE.md) - Development guidelines and conventions
- [README.md](./README.md) - Project overview

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review error messages in terminal and browser console
3. Check Docker container logs: `npm run docker:logs`
4. Verify all prerequisites are installed correctly

---

**Happy coding! 🚀**
