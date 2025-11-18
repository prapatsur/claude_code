// Session Types
export interface Session {
  id: string
  code: string
  name: string
  description?: string
  status: 'draft' | 'active' | 'ended'
  createdAt: string
  startsAt?: string
  endsAt?: string
  settings: SessionSettings
}

export interface SessionSettings {
  moderationEnabled: boolean
  allowAnonymous: boolean
  maxQuestionsPerUser?: number
}

// Question Types
export interface Question {
  id: string
  sessionId: string
  userId: string
  text: string
  isAnonymous: boolean
  votes: number
  status: 'pending' | 'approved' | 'rejected' | 'answered'
  answer?: string
  answeredAt?: string
  createdAt: string
  hasUserVoted?: boolean
  userNickname?: string
}

export interface QuestionVote {
  userId: string
  questionId: string
  createdAt: string
}

// Poll Types
export type PollType = 'multiple_choice' | 'rating' | 'text' | 'word_cloud'

export interface Poll {
  id: string
  sessionId: string
  question: string
  type: PollType
  options?: string[]
  settings: PollSettings
  status: 'draft' | 'active' | 'closed'
  createdAt: string
  results?: PollResults
}

export interface PollSettings {
  allowMultipleSelections?: boolean
  showResultsBeforeClose?: boolean
  ratingScale?: number // For rating type (e.g., 5 or 10)
}

export interface PollResponse {
  id: string
  pollId: string
  userId: string
  response: number | number[] | string // Flexible: index for multiple choice, number for rating, text for open
  createdAt: string
}

export interface PollResults {
  totalResponses: number
  options?: Array<{
    index: number
    text: string
    count: number
    percentage: number
  }>
  average?: number // For rating polls
  wordCloud?: Array<{ text: string; count: number }> // For word cloud polls
}

// Quiz Types
export interface Quiz {
  id: string
  sessionId: string
  title: string
  questions: QuizQuestion[]
  settings: QuizSettings
  status: 'draft' | 'active' | 'completed'
  createdAt: string
}

export interface QuizQuestion {
  index: number
  text: string
  options: string[]
  correctOptionIndex: number
  points: number
  timeLimit: number // seconds
}

export interface QuizResponse {
  id: string
  quizId: string
  userId: string
  questionIndex: number
  selectedOption: number
  isCorrect: boolean
  timeTaken: number // milliseconds
  pointsEarned: number
  createdAt: string
}

export interface QuizLeaderboardEntry {
  userId: string
  nickname: string
  totalPoints: number
  correctAnswers: number
  rank: number
}

// User Types
export interface User {
  id: string
  sessionId: string
  nickname: string
  createdAt: string
}

// WebSocket Event Types
export interface WSEvents {
  // Client to Server
  'session:join': { sessionCode: string; nickname?: string }
  'question:submit': { sessionId: string; text: string; isAnonymous: boolean }
  'question:vote': { questionId: string; userId: string }
  'question:unvote': { questionId: string; userId: string }
  'poll:respond': { pollId: string; response: number | number[] | string }
  'quiz:answer': { quizId: string; questionIndex: number; selectedOption: number; timeTaken: number }

  // Server to Client
  'session:joined': { sessionId: string; userId: string; session: Session }
  'session:update': Session
  'question:new': Question
  'question:update': Question
  'question:delete': { questionId: string }
  'poll:new': Poll
  'poll:update': Poll
  'poll:results': { pollId: string; results: PollResults }
  'quiz:start': Quiz
  'quiz:question': { quizId: string; questionIndex: number }
  'quiz:leaderboard': { quizId: string; leaderboard: QuizLeaderboardEntry[] }
  'quiz:end': { quizId: string; finalLeaderboard: QuizLeaderboardEntry[] }
  'error': { message: string }
}
