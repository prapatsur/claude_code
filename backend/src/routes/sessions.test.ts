import { describe, it, expect, beforeEach, vi } from 'vitest'
import express from 'express'
import request from 'supertest'
import sessionRoutes from './sessions.js'
import { query } from '../db/index.js'

// Create test app
const app = express()
app.use(express.json())
app.use('/api/sessions', sessionRoutes)

// Mock the query function
const mockQuery = query as ReturnType<typeof vi.fn>

describe('Sessions API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/sessions', () => {
    it('should create a new session', async () => {
      const mockSession = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        code: 'ABC12345',
        name: 'Test Session',
        description: 'Test Description',
        status: 'active',
        settings: { moderation_enabled: true, allow_anonymous: true },
        created_at: new Date().toISOString(),
      }

      mockQuery.mockResolvedValueOnce([mockSession])

      const response = await request(app)
        .post('/api/sessions')
        .send({
          name: 'Test Session',
          description: 'Test Description',
          settings: { moderation_enabled: true, allow_anonymous: true },
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('code')
      expect(response.body.name).toBe('Test Session')
    })

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/sessions')
        .send({
          description: 'Test Description',
        })

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Session name is required')
    })
  })

  describe('GET /api/sessions/code/:code', () => {
    it('should return session by code', async () => {
      const mockSession = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        code: 'ABC12345',
        name: 'Test Session',
        status: 'active',
      }

      mockQuery.mockResolvedValueOnce([mockSession])

      const response = await request(app).get('/api/sessions/code/ABC12345')

      expect(response.status).toBe(200)
      expect(response.body.code).toBe('ABC12345')
    })

    it('should return 404 if session not found', async () => {
      mockQuery.mockResolvedValueOnce([])

      const response = await request(app).get('/api/sessions/code/NOTFOUND')

      expect(response.status).toBe(404)
      expect(response.body.error).toBe('Session not found')
    })
  })

  describe('GET /api/sessions/:id', () => {
    it('should return session by ID', async () => {
      const mockSession = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        code: 'ABC12345',
        name: 'Test Session',
        status: 'active',
      }

      mockQuery.mockResolvedValueOnce([mockSession])

      const response = await request(app).get('/api/sessions/123e4567-e89b-12d3-a456-426614174000')

      expect(response.status).toBe(200)
      expect(response.body.id).toBe('123e4567-e89b-12d3-a456-426614174000')
    })

    it('should return 404 if session not found', async () => {
      mockQuery.mockResolvedValueOnce([])

      const response = await request(app).get('/api/sessions/nonexistent-id')

      expect(response.status).toBe(404)
      expect(response.body.error).toBe('Session not found')
    })
  })

  describe('PATCH /api/sessions/:id', () => {
    it('should update session', async () => {
      const mockSession = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        code: 'ABC12345',
        name: 'Updated Session',
        status: 'active',
      }

      mockQuery.mockResolvedValueOnce([mockSession])

      const response = await request(app)
        .patch('/api/sessions/123e4567-e89b-12d3-a456-426614174000')
        .send({ name: 'Updated Session' })

      expect(response.status).toBe(200)
      expect(response.body.name).toBe('Updated Session')
    })

    it('should return 400 if no fields to update', async () => {
      const response = await request(app)
        .patch('/api/sessions/123e4567-e89b-12d3-a456-426614174000')
        .send({})

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('No fields to update')
    })
  })

  describe('DELETE /api/sessions/:id', () => {
    it('should delete session', async () => {
      mockQuery.mockResolvedValueOnce([])

      const response = await request(app).delete('/api/sessions/123e4567-e89b-12d3-a456-426614174000')

      expect(response.status).toBe(204)
    })
  })
})
