# Audience Engagement Platform

A mobile-friendly, real-time audience engagement platform for live events, meetings, and presentations. Support 200+ concurrent users with features like Live Q&A, Polls, and Interactive Quizzes.

## Features

- **Live Q&A**: Real-time question submission, voting, and moderation
- **Interactive Polls**: Multiple choice, ratings, word clouds, and open text
- **Quizzes**: Timed questions with live leaderboards
- **Dual Display**: Separate views for participants (mobile/desktop) and presentation screens
- **Real-time Updates**: WebSocket-based instant synchronization
- **Scalable Architecture**: Supports 200+ concurrent users

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Socket.IO Client (WebSocket)
- Zustand (state management)

### Backend
- Node.js 20+
- Express.js + TypeScript
- Socket.IO (WebSocket server)
- PostgreSQL 15+ (database)
- Redis 7+ (cache & pub/sub)
- Prisma (ORM)

### DevOps
- Docker + Docker Compose
- GitHub Actions (CI/CD)

## Project Structure

```
/
├── frontend/          # React frontend application
├── backend/           # Node.js backend API & WebSocket server
├── shared/            # Shared types and utilities
├── docker-compose.yml # Local development environment
├── PRD.md            # Product Requirements Document
└── CLAUDE.md         # AI assistant documentation
```

## Getting Started

**👉 For detailed setup instructions, see [SETUP.md](./SETUP.md)**

### Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start database services:
   ```bash
   npm run docker:up
   ```

3. Set up environment files:
   ```bash
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```

4. Run database migrations:
   ```bash
   npm run migrate --workspace=backend
   ```

5. Start development servers:
   ```bash
   npm run dev
   ```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **WebSocket**: ws://localhost:3000

### Development Commands

```bash
# Start all services
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Run tests
npm test

# Build for production
npm run build

# Docker commands
npm run docker:up     # Start database services
npm run docker:down   # Stop database services
npm run docker:logs   # View database logs
```

## Architecture

### High-Level Overview

```
┌─────────────┐     WebSocket      ┌─────────────┐
│   Frontend  │ ◄─────────────────► │   Backend   │
│  (React)    │                     │  (Node.js)  │
└─────────────┘                     └──────┬──────┘
                                           │
                                    ┌──────┴──────┐
                                    │             │
                              ┌─────▼─────┐ ┌────▼─────┐
                              │ PostgreSQL│ │  Redis   │
                              │ (Database)│ │ (Cache)  │
                              └───────────┘ └──────────┘
```

### Real-Time Communication

- WebSocket connections via Socket.IO
- Redis Pub/Sub for multi-server scaling
- Automatic reconnection on network interruption
- Message delivery within 500ms (p95 target)

## MVP Features (Phase 1)

- [x] Project setup and architecture
- [x] Database schema and migrations
- [x] REST API endpoints (sessions, questions, polls)
- [x] WebSocket real-time communication
- [x] Frontend UI scaffolding (Home, Participant, Presentation, Organizer)
- [ ] Connect UI to backend APIs
- [ ] Complete Q&A flow (submit, vote, moderation)
- [ ] Complete polling flow (create, respond, results)
- [ ] Testing with 50+ concurrent users

## Contributing

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines and conventions.

## License

MIT

## Documentation

- **[Setup Guide (SETUP.md)](./SETUP.md)** - Detailed installation and development setup
- **[Product Requirements Document (PRD)](./PRD.md)** - Features, architecture, and roadmap
- **[AI Assistant Guide (CLAUDE.md)](./CLAUDE.md)** - Development guidelines and conventions

---

**Status**: 🚧 In Development (MVP Phase)
