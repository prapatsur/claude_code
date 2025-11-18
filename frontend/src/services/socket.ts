import { io, Socket } from 'socket.io-client'
import type { Session, Question, Poll } from '@/types'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000'

// Socket instance
let socket: Socket | null = null

// Event callback types
type JoinResponse = {
  success?: boolean
  error?: string
  sessionId?: string
  userId?: string
  session?: Session
}

type EventCallbacks = {
  onSessionUpdate?: (session: Session) => void
  onQuestionNew?: (question: Question) => void
  onQuestionUpdate?: (question: Question) => void
  onQuestionDelete?: (data: { questionId: string }) => void
  onPollNew?: (poll: Poll) => void
  onPollUpdate?: (poll: Poll) => void
  onError?: (data: { message: string }) => void
  onConnect?: () => void
  onDisconnect?: () => void
}

let callbacks: EventCallbacks = {}

// Initialize socket connection
export function initSocket(): Socket {
  if (socket) {
    return socket
  }

  socket = io(WS_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  })

  // Connection events
  socket.on('connect', () => {
    console.log('✅ WebSocket connected')
    callbacks.onConnect?.()
  })

  socket.on('disconnect', () => {
    console.log('❌ WebSocket disconnected')
    callbacks.onDisconnect?.()
  })

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error)
  })

  // Session events
  socket.on('session:update', (session: Session) => {
    callbacks.onSessionUpdate?.(session)
  })

  // Question events
  socket.on('question:new', (question: Question) => {
    callbacks.onQuestionNew?.(question)
  })

  socket.on('question:update', (question: Question) => {
    callbacks.onQuestionUpdate?.(question)
  })

  socket.on('question:delete', (data: { questionId: string }) => {
    callbacks.onQuestionDelete?.(data)
  })

  // Poll events
  socket.on('poll:new', (poll: Poll) => {
    callbacks.onPollNew?.(poll)
  })

  socket.on('poll:update', (poll: Poll) => {
    callbacks.onPollUpdate?.(poll)
  })

  // Error events
  socket.on('error', (data: { message: string }) => {
    console.error('WebSocket error:', data.message)
    callbacks.onError?.(data)
  })

  return socket
}

// Set event callbacks
export function setSocketCallbacks(newCallbacks: EventCallbacks) {
  callbacks = { ...callbacks, ...newCallbacks }
}

// Get socket instance
export function getSocket(): Socket | null {
  return socket
}

// Disconnect socket
export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Join a session
export function joinSession(
  sessionCode: string,
  nickname?: string
): Promise<JoinResponse> {
  return new Promise((resolve) => {
    const sock = initSocket()
    sock.emit(
      'session:join',
      { sessionCode, nickname },
      (response: JoinResponse) => {
        resolve(response)
      }
    )
  })
}

// Submit a question
export function submitQuestion(
  sessionId: string,
  text: string,
  isAnonymous: boolean
) {
  const sock = getSocket()
  if (sock) {
    sock.emit('question:submit', { sessionId, text, isAnonymous })
  }
}

// Vote on a question
export function voteQuestion(questionId: string) {
  const sock = getSocket()
  if (sock) {
    sock.emit('question:vote', { questionId })
  }
}

// Unvote on a question
export function unvoteQuestion(questionId: string) {
  const sock = getSocket()
  if (sock) {
    sock.emit('question:unvote', { questionId })
  }
}

// Respond to a poll
export function respondToPoll(
  pollId: string,
  response: number | number[] | string
) {
  const sock = getSocket()
  if (sock) {
    sock.emit('poll:respond', { pollId, response })
  }
}
