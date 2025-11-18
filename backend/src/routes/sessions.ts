import { Router } from 'express'
import { nanoid } from 'nanoid'
import { query } from '../db/index.js'
import type { Session } from '../types/index.js'

const router = Router()

// Generate unique session code
function generateSessionCode(): string {
  return nanoid(8).toUpperCase()
}

// Create a new session
router.post('/', async (req, res) => {
  try {
    const { name, description, settings } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Session name is required' })
    }

    const code = generateSessionCode()
    const defaultSettings = {
      moderation_enabled: true,
      allow_anonymous: true,
      ...settings,
    }

    const result = await query<Session>(
      `INSERT INTO sessions (code, name, description, settings, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [code, name, description, JSON.stringify(defaultSettings), 'active']
    )

    res.status(201).json(result[0])
  } catch (error) {
    console.error('Error creating session:', error)
    res.status(500).json({ error: 'Failed to create session' })
  }
})

// Get session by code
router.get('/code/:code', async (req, res) => {
  try {
    const { code } = req.params

    const result = await query<Session>(
      'SELECT * FROM sessions WHERE code = $1',
      [code.toUpperCase()]
    )

    if (result.length === 0) {
      return res.status(404).json({ error: 'Session not found' })
    }

    res.json(result[0])
  } catch (error) {
    console.error('Error fetching session:', error)
    res.status(500).json({ error: 'Failed to fetch session' })
  }
})

// Get session by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await query<Session>(
      'SELECT * FROM sessions WHERE id = $1',
      [id]
    )

    if (result.length === 0) {
      return res.status(404).json({ error: 'Session not found' })
    }

    res.json(result[0])
  } catch (error) {
    console.error('Error fetching session:', error)
    res.status(500).json({ error: 'Failed to fetch session' })
  }
})

// Update session
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, status, settings } = req.body

    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`)
      values.push(name)
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`)
      values.push(description)
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`)
      values.push(status)
    }
    if (settings !== undefined) {
      updates.push(`settings = $${paramIndex++}`)
      values.push(JSON.stringify(settings))
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    values.push(id)
    const result = await query<Session>(
      `UPDATE sessions SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )

    if (result.length === 0) {
      return res.status(404).json({ error: 'Session not found' })
    }

    res.json(result[0])
  } catch (error) {
    console.error('Error updating session:', error)
    res.status(500).json({ error: 'Failed to update session' })
  }
})

// Delete session
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    await query('DELETE FROM sessions WHERE id = $1', [id])

    res.status(204).send()
  } catch (error) {
    console.error('Error deleting session:', error)
    res.status(500).json({ error: 'Failed to delete session' })
  }
})

export default router
