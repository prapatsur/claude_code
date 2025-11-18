-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(8) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'ended')),
  settings JSONB DEFAULT '{"moderation_enabled": true, "allow_anonymous": true}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  starts_at TIMESTAMP,
  ends_at TIMESTAMP
);

-- Users table (lightweight, session-based)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  nickname VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  votes INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'answered')),
  answer TEXT,
  answered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Question votes table
CREATE TABLE IF NOT EXISTS question_votes (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, question_id)
);

-- Polls table
CREATE TABLE IF NOT EXISTS polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'multiple_choice' CHECK (type IN ('multiple_choice', 'rating', 'text', 'word_cloud')),
  options JSONB, -- Array of options for multiple choice: ["Option 1", "Option 2"]
  settings JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Poll responses table
CREATE TABLE IF NOT EXISTS poll_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  response JSONB NOT NULL, -- Flexible: array for multiple choice, number for rating, text for open
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(poll_id, user_id) -- One response per user per poll
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  title VARCHAR(200),
  questions JSONB NOT NULL, -- Array of questions with options and correct answers
  settings JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quiz responses table
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  selected_option INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken INTEGER NOT NULL, -- milliseconds
  points_earned INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_code ON sessions(code);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_users_session ON users(session_id);
CREATE INDEX IF NOT EXISTS idx_questions_session ON questions(session_id);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_votes ON questions(votes DESC);
CREATE INDEX IF NOT EXISTS idx_question_votes_question ON question_votes(question_id);
CREATE INDEX IF NOT EXISTS idx_polls_session ON polls(session_id);
CREATE INDEX IF NOT EXISTS idx_poll_responses_poll ON poll_responses(poll_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_quiz ON quiz_responses(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_user ON quiz_responses(user_id, quiz_id);
