import express from 'express'
import { createServer } from 'http'
import { Server as SocketIO } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { initializeSocket } from './socket/index.js'
import sessionRoutes from './routes/sessions.js'
import questionRoutes from './routes/questions.js'
import pollRoutes from './routes/polls.js'

// Load environment variables
dotenv.config()

const app = express()
const httpServer = createServer(app)

// Socket.IO setup
const io = new SocketIO(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}))
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/sessions', sessionRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/polls', pollRoutes)

// Initialize WebSocket handlers
initializeSocket(io)

// Start server
const PORT = process.env.PORT || 3000

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 WebSocket server ready`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  httpServer.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})
