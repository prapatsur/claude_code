# Product Requirements Document (PRD)
# Audience Engagement Platform

**Version**: 1.0
**Date**: 2025-11-18
**Status**: Draft
**Author**: Product Team

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [User Personas](#user-personas)
4. [Core Features](#core-features)
5. [Technical Requirements](#technical-requirements)
6. [Architecture & Scalability](#architecture--scalability)
7. [User Experience](#user-experience)
8. [Success Metrics](#success-metrics)
9. [Implementation Phases](#implementation-phases)
10. [Future Considerations](#future-considerations)

---

## Executive Summary

### Product Vision
Build a mobile-first, web-based audience engagement platform that enables real-time interaction between presenters and audiences through voting, Q&A, quizzes, and polls. The platform must support at least 200 concurrent users while providing both participant views (mobile/desktop) and presentation displays (large screens).

### Key Objectives
- **Accessibility**: Mobile-friendly interface accessible from any device
- **Scalability**: Support 200+ concurrent users with real-time updates
- **Engagement**: Provide interactive features (voting, Q&A, quizzes, polls)
- **Dual Display**: Separate views for participants and presentation screens
- **Performance**: Sub-second latency for real-time interactions

---

## Product Overview

### Problem Statement
Traditional meetings and events lack effective real-time audience engagement tools. Presenters need a way to:
- Collect questions from large audiences efficiently
- Gauge audience opinions through instant polls
- Maintain engagement with interactive quizzes
- Display aggregated results to all participants

### Solution
A web-based platform that provides:
- Real-time Q&A with voting and moderation
- Live polls with multiple formats (multiple choice, word clouds, ratings)
- Interactive quizzes with leaderboards
- Dual-screen architecture (participant + presentation view)
- No app installation required (pure web)

### Target Audience
- **Primary**: Event organizers, corporate presenters, educators, conference hosts
- **Secondary**: Meeting participants, students, event attendees

---

## User Personas

### Persona 1: Event Organizer/Presenter
**Name**: Sarah, Conference Moderator
**Goals**:
- Collect and moderate audience questions
- Run polls to gauge audience sentiment
- Keep audience engaged throughout sessions
- Display results professionally on large screens

**Pain Points**:
- Managing 100+ questions simultaneously
- Filtering inappropriate or duplicate content
- Technical complexity of existing tools

### Persona 2: Participant (Mobile User)
**Name**: Mike, Conference Attendee
**Goals**:
- Ask questions during presentations
- Vote on questions from others
- Participate in polls and quizzes
- See live results

**Pain Points**:
- Small mobile screen real estate
- Slow loading times
- Complex interfaces
- Having to download apps

### Persona 3: Presenter
**Name**: Dr. Chen, Keynote Speaker
**Goals**:
- Monitor incoming questions while presenting
- Launch polls at specific moments
- See aggregated audience feedback
- Maintain presentation flow

**Pain Points**:
- Context switching between presentation and engagement tool
- Difficult to moderate during live presentation
- Results not visible to entire audience

---

## Core Features

### 1. Live Q&A

#### 1.1 Question Submission
- **User Story**: As a participant, I want to submit questions during a session so that the presenter can address my concerns.
- **Requirements**:
  - Text input (max 500 characters)
  - Optional anonymity
  - Real-time submission
  - Character counter
  - Submit confirmation

#### 1.2 Question Voting
- **User Story**: As a participant, I want to upvote questions I find interesting so that popular questions get answered first.
- **Requirements**:
  - One vote per question per user
  - Real-time vote count updates
  - Visual indication of voted questions
  - Sort by votes (descending)
  - Remove vote capability

#### 1.3 Question Moderation
- **User Story**: As an organizer, I want to moderate questions before they appear publicly so that inappropriate content is filtered.
- **Requirements**:
  - Pending/Approved/Rejected states
  - Bulk actions (approve/reject multiple)
  - Mark as answered
  - Pin important questions
  - Delete capability
  - Search/filter questions

#### 1.4 Answer Display
- **User Story**: As a presenter, I want to answer questions and have those answers visible to all participants.
- **Requirements**:
  - Text answer input
  - Mark as answered status
  - Display answer below question
  - Answer timestamp
  - Edit/delete answer

### 2. Live Polls

#### 2.1 Poll Types
- **Multiple Choice**: Single or multiple selection
- **Rating Scale**: 1-5 or 1-10 scale
- **Open Text**: Short text responses
- **Word Cloud**: Text aggregation with frequency visualization

#### 2.2 Poll Creation
- **User Story**: As an organizer, I want to create polls before or during sessions so that I can gather audience feedback.
- **Requirements**:
  - Multiple poll types support
  - 2-10 options for multiple choice
  - Custom question text (max 200 chars)
  - Save as draft
  - Schedule/launch immediately
  - Set response limit (time or count)

#### 2.3 Poll Participation
- **User Story**: As a participant, I want to quickly respond to polls so that my voice is heard.
- **Requirements**:
  - Clear question display
  - Easy option selection
  - Submit confirmation
  - View results after submission
  - Change answer before poll closes (optional)

#### 2.4 Results Display
- **User Story**: As a presenter, I want to display poll results on the big screen so that everyone can see the aggregated responses.
- **Requirements**:
  - Real-time result updates
  - Visual charts (bar, pie, word cloud)
  - Percentage and absolute counts
  - Export results (CSV/PDF)
  - Hide results until poll closes (optional)

### 3. Interactive Quizzes

#### 3.1 Quiz Creation
- **User Story**: As an organizer, I want to create quizzes to test audience knowledge and maintain engagement.
- **Requirements**:
  - Multiple choice questions (2-6 options)
  - Correct answer designation
  - Points assignment (customizable)
  - Time limits per question (10-60 seconds)
  - Multiple questions per quiz (1-20)

#### 3.2 Quiz Participation
- **User Story**: As a participant, I want to compete in quizzes and see my ranking so that learning is gamified.
- **Requirements**:
  - Countdown timer display
  - Instant feedback (correct/incorrect)
  - Points earned notification
  - Current rank display
  - Progress indicator (question X of Y)

#### 3.3 Leaderboard
- **User Story**: As a participant, I want to see how I rank compared to others so that I stay motivated.
- **Requirements**:
  - Top 10 participants display
  - Live updates after each question
  - User highlighting (your position)
  - Final rankings at quiz end
  - Export leaderboard

### 4. Session Management

#### 4.1 Session Creation
- **User Story**: As an organizer, I want to create sessions in advance so that I can prepare all engagement materials.
- **Requirements**:
  - Session name and description
  - Unique session code (6-8 characters)
  - Start/end date and time
  - Pre-load polls and quizzes
  - Session settings (moderation level, anonymity, etc.)

#### 4.2 Session Join
- **User Story**: As a participant, I want to join sessions easily without creating an account.
- **Requirements**:
  - Join via session code or URL
  - Optional nickname entry
  - No registration required
  - Remember last session (cookie)
  - Quick rejoin capability

#### 4.3 Session Control
- **User Story**: As an organizer, I want to control session flow so that engagement activities happen at the right time.
- **Requirements**:
  - Enable/disable Q&A
  - Launch polls
  - Start/stop quizzes
  - Display specific content on presentation screen
  - End session
  - Session analytics dashboard

### 5. Dual Display System

#### 5.1 Participant View (Mobile/Desktop)
- **Responsive design** (320px - 1920px width)
- **Compact interface** for mobile devices
- **Feature tabs**: Q&A, Polls, Quiz, Results
- **Notifications** for new polls/quizzes
- **Offline indicator**

#### 5.2 Presentation View (Large Screen)
- **Full-screen mode** optimized for projectors
- **High contrast** for visibility
- **Auto-refresh** for live data
- **Display modes**:
  - Live Q&A feed with top questions
  - Poll results visualization
  - Quiz leaderboard
  - Word cloud display
  - Welcome screen with session code

---

## Technical Requirements

### Functional Requirements

#### FR1: Real-Time Communication
- WebSocket connections for bi-directional communication
- Message delivery within 500ms (95th percentile)
- Automatic reconnection on network interruption
- Graceful degradation to polling if WebSocket unavailable

#### FR2: Scalability
- Support 200 concurrent users per session minimum
- Support 10 simultaneous sessions
- Horizontal scaling capability for growth
- Database query optimization for real-time aggregations

#### FR3: Browser Compatibility
- **Modern browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile browsers**: iOS Safari, Android Chrome
- **No plugin/extension required**

#### FR4: Data Persistence
- All questions, polls, and quiz responses stored
- Session history retention (90 days)
- Export capabilities for all data
- Audit trail for moderation actions

#### FR5: Security
- Input sanitization (XSS prevention)
- Rate limiting (prevent spam)
- Session-based authentication
- Admin authentication for organizers
- HTTPS only
- CORS configuration

### Non-Functional Requirements

#### NFR1: Performance
- **Page load**: < 2 seconds (3G network)
- **Time to Interactive**: < 3 seconds
- **WebSocket latency**: < 500ms (p95)
- **Database queries**: < 100ms (p95)

#### NFR2: Availability
- **Uptime**: 99.5% target
- **Graceful degradation**: Display cached data if backend unavailable
- **Error handling**: User-friendly error messages

#### NFR3: Usability
- **Mobile-first design**: Touch-optimized interfaces
- **Accessibility**: WCAG 2.1 Level AA compliance
- **Internationalization**: UTF-8 support for all languages
- **Minimal clicks**: ≤ 2 clicks for primary actions

#### NFR4: Maintainability
- **Code quality**: ESLint, Prettier, TypeScript strict mode
- **Test coverage**: 80%+ for business logic
- **Documentation**: API docs, component docs
- **Monitoring**: Error tracking, performance monitoring

---

## Architecture & Scalability

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Load Balancer                        │
│                    (nginx / Caddy)                       │
└────────────────────┬────────────────────────────────────┘
                     │
      ┌──────────────┼──────────────┐
      │              │              │
┌─────▼─────┐  ┌────▼─────┐  ┌────▼─────┐
│ Web Server│  │Web Server│  │Web Server│
│  (Node.js)│  │ (Node.js)│  │ (Node.js)│
└─────┬─────┘  └────┬─────┘  └────┬─────┘
      │              │              │
      └──────────────┼──────────────┘
                     │
      ┌──────────────┴──────────────┐
      │                             │
┌─────▼─────┐              ┌────────▼─────┐
│  Database │              │     Redis     │
│ PostgreSQL│              │ (Sessions +   │
│           │              │  Pub/Sub)     │
└───────────┘              └───────────────┘
```

### Technology Stack Recommendations

#### Frontend
- **Framework**: React 18+ or Vue 3+ or Svelte
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Tailwind CSS + shadcn/ui or Material-UI
- **State Management**: Zustand or Pinia or Redux Toolkit
- **WebSocket Client**: Socket.IO client or native WebSocket
- **Charts**: Chart.js or Recharts

#### Backend
- **Runtime**: Node.js 20+ (LTS)
- **Framework**: Express.js or Fastify or Hono
- **Language**: TypeScript
- **WebSocket**: Socket.IO or ws
- **API**: REST + WebSocket hybrid
- **Validation**: Zod or Joi

#### Database
- **Primary**: PostgreSQL 15+ (JSONB for flexibility)
- **Cache**: Redis 7+ (session storage, pub/sub)
- **Alternative**: MongoDB or SQLite (for MVP)

#### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel/Netlify (frontend) + Railway/Render/Fly.io (backend)
- **Monitoring**: Sentry (errors) + PostHog/Plausible (analytics)

### Database Schema (Draft)

```sql
-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  starts_at TIMESTAMP,
  ends_at TIMESTAMP,
  settings JSONB,
  status VARCHAR(20) -- 'draft', 'active', 'ended'
);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  user_id UUID,
  text TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  votes INT DEFAULT 0,
  status VARCHAR(20), -- 'pending', 'approved', 'rejected', 'answered'
  answer TEXT,
  answered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Question Votes
CREATE TABLE question_votes (
  user_id UUID,
  question_id UUID REFERENCES questions(id),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, question_id)
);

-- Polls
CREATE TABLE polls (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  question TEXT NOT NULL,
  type VARCHAR(20), -- 'multiple_choice', 'rating', 'text', 'word_cloud'
  options JSONB, -- Array of options for multiple choice
  settings JSONB,
  status VARCHAR(20), -- 'draft', 'active', 'closed'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Poll Responses
CREATE TABLE poll_responses (
  id UUID PRIMARY KEY,
  poll_id UUID REFERENCES polls(id),
  user_id UUID,
  response JSONB, -- Flexible: array for multiple choice, number for rating, text for open
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quizzes
CREATE TABLE quizzes (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  title VARCHAR(200),
  questions JSONB, -- Array of questions with options and correct answers
  settings JSONB,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quiz Responses
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id),
  user_id UUID,
  question_index INT,
  selected_option INT,
  is_correct BOOLEAN,
  time_taken INT, -- milliseconds
  points_earned INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users (lightweight, session-based)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  nickname VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_questions_session ON questions(session_id);
CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_polls_session ON polls(session_id);
CREATE INDEX idx_quiz_responses_user ON quiz_responses(user_id, quiz_id);
```

### Scaling Strategy

#### Phase 1: Single Server (MVP)
- **Target**: 50-100 concurrent users
- **Setup**: Single server with PostgreSQL + Redis
- **Cost**: ~$20-30/month

#### Phase 2: Horizontal Scaling
- **Target**: 200-500 concurrent users
- **Setup**:
  - Load balancer (nginx)
  - 2-3 web servers
  - Shared PostgreSQL + Redis
  - Sticky sessions via Redis
- **Cost**: ~$80-120/month

#### Phase 3: High Availability
- **Target**: 1000+ concurrent users
- **Setup**:
  - Auto-scaling web servers
  - PostgreSQL with read replicas
  - Redis cluster
  - CDN for static assets
- **Cost**: ~$300-500/month

### WebSocket Scaling Considerations

- **Redis Pub/Sub**: Broadcast messages across multiple server instances
- **Sticky Sessions**: Keep users connected to same server instance
- **Heartbeat**: Detect and clean up dead connections
- **Message Queue**: Buffer high-frequency updates

---

## User Experience

### Mobile Interface (320px - 768px)

#### Home Screen (Join Session)
```
┌──────────────────────────┐
│   [Logo]                 │
│                          │
│   Join a Session         │
│                          │
│  ┌────────────────────┐  │
│  │ Enter Session Code│  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │   Your Nickname    │  │
│  └────────────────────┘  │
│                          │
│      [Join Session]      │
│                          │
└──────────────────────────┘
```

#### Participant View (Tabs)
```
┌──────────────────────────┐
│  Session: Tech Talk 2025 │
├──────────────────────────┤
│ [Q&A] [Polls] [Quiz]     │
├──────────────────────────┤
│                          │
│  ┌────────────────────┐  │
│  │ Ask a question...  │  │
│  └────────────────────┘  │
│                          │
│  Top Questions:          │
│                          │
│  [▲ 42] How do we scale? │
│         - Anonymous      │
│                          │
│  [▲ 38] What about cost? │
│         - Sarah M.       │
│                          │
│  [▲ 25] Timeline?        │
│         - John D.        │
│                          │
└──────────────────────────┘
```

### Desktop/Presentation View (1920px+)

#### Organizer Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  Session: Tech Talk 2025          [End Session] [⚙️]    │
├─────────────────────────────────────────────────────────┤
│  Participants: 156    Questions: 24    Polls: 3 active  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │   Q&A Queue      │  │  Pending (8)     │             │
│  │                  │  │                  │             │
│  │  [Approve] [...] │  │  How long will...│             │
│  │  [Reject]  [...] │  │  What about... │             │
│  │  [Pin]     [...] │  │                  │             │
│  └──────────────────┘  └──────────────────┘             │
│                                                          │
│  ┌──────────────────────────────────┐                   │
│  │   Create New Poll                │                   │
│  │   [Multiple Choice] [Rating] [..] │                  │
│  └──────────────────────────────────┘                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Presentation Display (Full Screen)
```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│              LIVE Q&A - 156 Participants                 │
│                                                          │
│                                                          │
│   ▲ 42    How do we handle scaling to 1000 users?       │
│                                                          │
│   ▲ 38    What is the expected infrastructure cost?     │
│                                                          │
│   ▲ 25    What's the implementation timeline?           │
│                                                          │
│   ▲ 18    Can we integrate with our existing auth?      │
│                                                          │
│   ▲ 15    Will this work offline?                       │
│                                                          │
│                                                          │
│                    Session Code: TECH2025                │
│                    pigeonhole.yourcompany.com            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Interaction Flows

#### Flow 1: Join Session and Ask Question
1. User scans QR code or types session code
2. (Optional) Enter nickname
3. Lands on Q&A tab
4. Clicks "Ask a question"
5. Types question (character counter visible)
6. Clicks Submit
7. Sees confirmation "Question submitted for moderation"
8. Question appears in list once approved
9. User can upvote other questions

#### Flow 2: Organizer Launches Poll
1. Organizer clicks "New Poll" in dashboard
2. Selects poll type (e.g., Multiple Choice)
3. Enters question and options
4. Clicks "Launch Poll"
5. All participants receive notification
6. Participants vote
7. Results update in real-time on presentation screen
8. Organizer closes poll
9. Final results displayed

#### Flow 3: Quiz Competition
1. Organizer clicks "Start Quiz"
2. Presentation screen shows countdown (3...2...1...)
3. First question appears on all screens
4. Participants select answers
5. Timer counts down (30 seconds)
6. Correct answer revealed
7. Leaderboard updates
8. Next question loads
9. Repeat until all questions done
10. Final leaderboard displayed

---

## Success Metrics

### User Engagement Metrics
- **Session Participation Rate**: % of attendees who join the platform
  - Target: >70%
- **Questions per Session**: Average number of questions submitted
  - Target: >20 for 100+ person events
- **Poll Response Rate**: % of participants who respond to polls
  - Target: >60%
- **Quiz Participation Rate**: % of participants who join quizzes
  - Target: >50%

### Technical Metrics
- **Page Load Time**: Time to first interactive
  - Target: <3 seconds (p95)
- **WebSocket Latency**: Message round-trip time
  - Target: <500ms (p95)
- **Uptime**: System availability
  - Target: >99.5%
- **Error Rate**: % of requests resulting in errors
  - Target: <1%

### Business Metrics
- **Session Creation Rate**: New sessions created per week
  - Target: 10+ sessions/week (after launch)
- **User Retention**: Users who return for multiple sessions
  - Target: 30% monthly retention
- **Average Session Duration**: Time users spend in sessions
  - Target: >20 minutes
- **Net Promoter Score (NPS)**: User satisfaction
  - Target: >50

---

## Implementation Phases

### Phase 1: MVP (4-6 weeks)
**Goal**: Core functionality for single session with 50 users

**Features**:
- ✅ Session creation and join
- ✅ Live Q&A (submit, view, vote)
- ✅ Basic moderation (approve/reject)
- ✅ Simple poll (multiple choice only)
- ✅ Participant view (mobile-responsive)
- ✅ Presentation view (basic display)

**Tech Stack**:
- Frontend: React + TypeScript + Vite + Tailwind
- Backend: Node.js + Express + Socket.IO
- Database: PostgreSQL
- Cache: Redis
- Hosting: Single server (Render/Railway)

**Success Criteria**:
- 50 concurrent users supported
- <3s page load time
- Basic functionality working end-to-end

### Phase 2: Scalability & Features (4-6 weeks)
**Goal**: Scale to 200+ users and add advanced features

**Features**:
- ✅ Horizontal scaling (load balancer + multiple servers)
- ✅ Quiz functionality with leaderboard
- ✅ Advanced poll types (rating, word cloud)
- ✅ Enhanced moderation (pin, mark answered)
- ✅ Analytics dashboard for organizers
- ✅ Session history and export

**Tech Stack Additions**:
- Load balancer (nginx)
- Redis pub/sub for multi-server WebSockets
- PostgreSQL connection pooling
- CDN for static assets

**Success Criteria**:
- 200+ concurrent users supported
- <500ms WebSocket latency (p95)
- All core features complete

### Phase 3: Polish & Advanced Features (3-4 weeks)
**Goal**: Production-ready with premium features

**Features**:
- ✅ User authentication for organizers
- ✅ Multi-session management
- ✅ Advanced analytics and reports
- ✅ Custom branding
- ✅ Integration APIs (webhooks)
- ✅ Mobile PWA support
- ✅ Accessibility improvements (WCAG 2.1 AA)

**Tech Stack Additions**:
- OAuth2 for organizer authentication
- Rate limiting and DDoS protection
- Monitoring (Sentry, PostHog)
- Automated testing suite

**Success Criteria**:
- 99.5% uptime
- WCAG 2.1 AA compliant
- 80%+ test coverage
- Production monitoring in place

---

## Future Considerations

### Nice-to-Have Features
- **AI-powered question moderation**: Auto-filter spam/inappropriate content
- **Multi-language support**: Real-time translation of questions
- **Breakout rooms**: Split large sessions into smaller groups
- **Recording and replay**: Save and replay sessions
- **Advanced analytics**: Sentiment analysis, engagement heatmaps
- **Mobile apps**: Native iOS/Android apps
- **Integrations**: Zoom, Teams, Google Meet plugins
- **Gamification**: Badges, points, achievements
- **Custom themes**: White-label branding
- **API access**: Third-party integrations

### Technical Debt to Avoid
- **Over-engineering**: Don't build for 10,000 users if serving 200
- **Premature optimization**: Profile before optimizing
- **Tight coupling**: Keep frontend/backend loosely coupled
- **Monolithic architecture**: Plan for microservices if needed later

### Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| WebSocket scaling issues | High | Medium | Redis pub/sub, load testing |
| Database performance degradation | High | Medium | Indexing, caching, read replicas |
| High infrastructure costs | Medium | Medium | Auto-scaling, cost monitoring |
| Browser compatibility issues | Medium | Low | Comprehensive testing matrix |
| Security vulnerabilities | High | Low | Security audits, penetration testing |
| User adoption challenges | High | Medium | User testing, onboarding improvements |

---

## Appendix

### A. Competitive Analysis

| Feature | Pigeonhole | Slido | Mentimeter | Our Platform |
|---------|-----------|-------|------------|--------------|
| Live Q&A | ✅ | ✅ | ✅ | ✅ (Phase 1) |
| Polls | ✅ | ✅ | ✅ | ✅ (Phase 1) |
| Quizzes | ✅ | ✅ | ✅ | ✅ (Phase 2) |
| Word Clouds | ✅ | ✅ | ✅ | ✅ (Phase 2) |
| 200+ users | ✅ | ✅ | ✅ | ✅ (Phase 2) |
| Free tier | Limited | Limited | Limited | TBD |
| Open source | ❌ | ❌ | ❌ | Potential |

### B. Glossary

- **Session**: A single event or meeting instance
- **Organizer**: Person who creates and manages sessions
- **Participant**: Person who joins sessions to engage
- **Presenter**: Person presenting content (may be same as organizer)
- **Moderation**: Process of reviewing and approving content
- **WebSocket**: Protocol for real-time bi-directional communication
- **p95**: 95th percentile (95% of requests faster than this value)

### C. References

- [Pigeonhole Live](https://pigeonholelive.com/)
- [WebSocket Protocol](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Document Status**: Ready for Review
**Next Steps**: Team review → Technical design document → Prototype development

