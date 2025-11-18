import { Server as SocketIO } from 'socket.io'
import { nanoid } from 'nanoid'
import { query } from '../db/index.js'
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  Session,
  Question,
  User
} from '../types/index.js'

export function initializeSocket(io: SocketIO<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
  console.log('🔌 Initializing WebSocket handlers...')

  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`)

    // Handle session join
    socket.on('session:join', async (data, callback) => {
      try {
        const { sessionCode, nickname } = data

        // Find session
        const sessionResult = await query<Session>(
          'SELECT * FROM sessions WHERE code = $1 AND status = $2',
          [sessionCode.toUpperCase(), 'active']
        )

        if (sessionResult.length === 0) {
          callback({ error: 'Session not found or not active' })
          return
        }

        const session = sessionResult[0]

        // Create user
        const userResult = await query<User>(
          'INSERT INTO users (session_id, nickname) VALUES ($1, $2) RETURNING *',
          [session.id, nickname || 'Anonymous']
        )

        const user = userResult[0]

        // Store user info in socket data
        socket.data.userId = user.id
        socket.data.sessionId = session.id

        // Join room for this session
        socket.join(`session:${session.id}`)

        // Send success response
        callback({
          success: true,
          sessionId: session.id,
          userId: user.id,
          session
        })

        // Broadcast to room that user joined
        io.to(`session:${session.id}`).emit('session:update', session)

        console.log(`👤 User ${user.id} joined session ${session.code}`)
      } catch (error) {
        console.error('Error joining session:', error)
        callback({ error: 'Failed to join session' })
      }
    })

    // Handle question submission
    socket.on('question:submit', async (data) => {
      try {
        const { sessionId, text, isAnonymous } = data
        const userId = socket.data.userId

        if (!userId) {
          socket.emit('error', { message: 'Not authenticated' })
          return
        }

        // Get session settings
        const sessionResult = await query(
          'SELECT settings FROM sessions WHERE id = $1',
          [sessionId]
        )

        if (sessionResult.length === 0) {
          socket.emit('error', { message: 'Session not found' })
          return
        }

        const settings = sessionResult[0].settings
        const initialStatus = settings.moderation_enabled ? 'pending' : 'approved'

        // Create question
        const questionResult = await query<Question>(
          `INSERT INTO questions (session_id, user_id, text, is_anonymous, status)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [sessionId, userId, text, isAnonymous, initialStatus]
        )

        const question = questionResult[0]

        // Broadcast to session room
        if (question.status === 'approved') {
          io.to(`session:${sessionId}`).emit('question:new', question)
        }

        console.log(`📝 Question submitted in session ${sessionId}`)
      } catch (error) {
        console.error('Error submitting question:', error)
        socket.emit('error', { message: 'Failed to submit question' })
      }
    })

    // Handle question vote
    socket.on('question:vote', async (data) => {
      try {
        const { questionId } = data
        const userId = socket.data.userId

        if (!userId) {
          socket.emit('error', { message: 'Not authenticated' })
          return
        }

        // Insert vote
        await query(
          'INSERT INTO question_votes (user_id, question_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [userId, questionId]
        )

        // Update question votes count
        await query(
          'UPDATE questions SET votes = (SELECT COUNT(*) FROM question_votes WHERE question_id = $1) WHERE id = $1',
          [questionId]
        )

        // Get updated question
        const questionResult = await query<Question>(
          'SELECT * FROM questions WHERE id = $1',
          [questionId]
        )

        if (questionResult.length > 0) {
          const question = questionResult[0]
          // Broadcast to session
          io.to(`session:${question.session_id}`).emit('question:update', question)
        }
      } catch (error) {
        console.error('Error voting on question:', error)
        socket.emit('error', { message: 'Failed to vote on question' })
      }
    })

    // Handle question unvote
    socket.on('question:unvote', async (data) => {
      try {
        const { questionId } = data
        const userId = socket.data.userId

        if (!userId) {
          socket.emit('error', { message: 'Not authenticated' })
          return
        }

        // Delete vote
        await query(
          'DELETE FROM question_votes WHERE user_id = $1 AND question_id = $2',
          [userId, questionId]
        )

        // Update question votes count
        await query(
          'UPDATE questions SET votes = (SELECT COUNT(*) FROM question_votes WHERE question_id = $1) WHERE id = $1',
          [questionId]
        )

        // Get updated question
        const questionResult = await query<Question>(
          'SELECT * FROM questions WHERE id = $1',
          [questionId]
        )

        if (questionResult.length > 0) {
          const question = questionResult[0]
          // Broadcast to session
          io.to(`session:${question.session_id}`).emit('question:update', question)
        }
      } catch (error) {
        console.error('Error unvoting on question:', error)
        socket.emit('error', { message: 'Failed to unvote on question' })
      }
    })

    // Handle poll response
    socket.on('poll:respond', async (data) => {
      try {
        const { pollId, response } = data
        const userId = socket.data.userId

        if (!userId) {
          socket.emit('error', { message: 'Not authenticated' })
          return
        }

        // Submit response
        await query(
          `INSERT INTO poll_responses (poll_id, user_id, response)
           VALUES ($1, $2, $3)
           ON CONFLICT (poll_id, user_id) DO UPDATE SET response = $3`,
          [pollId, userId, JSON.stringify(response)]
        )

        console.log(`📊 Poll response submitted for poll ${pollId}`)
      } catch (error) {
        console.error('Error submitting poll response:', error)
        socket.emit('error', { message: 'Failed to submit poll response' })
      }
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`)
    })
  })

  return io
}
