// Session Types
export interface Session {
  id: string
  code: string
  name: string
  description?: string
  status: 'draft' | 'active' | 'ended'
  created_at: string
  starts_at?: string
  ends_at?: string
  settings: SessionSettings
}

export interface SessionSettings {
  moderation_enabled: boolean
  allow_anonymous: boolean
  max_questions_per_user?: number
}

// Question Types
export interface Question {
  id: string
  session_id: string
  user_id: string
  text: string
  is_anonymous: boolean
  votes: number
  status: 'pending' | 'approved' | 'rejected' | 'answered'
  answer?: string
  answered_at?: string
  created_at: string
}

export interface QuestionVote {
  user_id: string
  question_id: string
  created_at: string
}

// Poll Types
export type PollType = 'multiple_choice' | 'rating' | 'text' | 'word_cloud'

export interface Poll {
  id: string
  session_id: string
  question: string
  type: PollType
  options?: string[]
  settings: PollSettings
  status: 'draft' | 'active' | 'closed'
  created_at: string
}

export interface PollSettings {
  allow_multiple_selections?: boolean
  show_results_before_close?: boolean
  rating_scale?: number
}

export interface PollResponse {
  id: string
  poll_id: string
  user_id: string
  response: number | number[] | string
  created_at: string
}

// User Types
export interface User {
  id: string
  session_id: string
  nickname: string
  created_at: string
}

// WebSocket Event Types
export interface ServerToClientEvents {
  'session:joined': (data: { sessionId: string; userId: string; session: Session }) => void
  'session:update': (session: Session) => void
  'question:new': (question: Question) => void
  'question:update': (question: Question) => void
  'question:delete': (data: { questionId: string }) => void
  'poll:new': (poll: Poll) => void
  'poll:update': (poll: Poll) => void
  'error': (data: { message: string }) => void
}

export interface ClientToServerEvents {
  'session:join': (data: { sessionCode: string; nickname?: string }, callback: (response: any) => void) => void
  'question:submit': (data: { sessionId: string; text: string; isAnonymous: boolean }) => void
  'question:vote': (data: { questionId: string }) => void
  'question:unvote': (data: { questionId: string }) => void
  'poll:respond': (data: { pollId: string; response: number | number[] | string }) => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface SocketData {
  userId: string
  sessionId: string
}
