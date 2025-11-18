import { Router } from 'express'
import { query, transaction } from '../db/index.js'
import type { Question } from '../types/index.js'

const router = Router()

// Get questions for a session
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { status, userId } = req.query

    let sql = 'SELECT q.*, '
    sql += '(SELECT COUNT(*) FROM question_votes WHERE question_id = q.id) as votes'

    if (userId) {
      sql += `, (SELECT COUNT(*) > 0 FROM question_votes WHERE question_id = q.id AND user_id = $2) as has_user_voted`
    }

    sql += ' FROM questions q WHERE q.session_id = $1'

    const params: any[] = [sessionId]
    let paramIndex = 2

    if (status) {
      sql += ` AND q.status = $${paramIndex++}`
      params.push(status)
    }

    sql += ' ORDER BY votes DESC, q.created_at DESC'

    if (userId) {
      params.push(userId)
    }

    const result = await query<Question>(sql, params)

    res.json(result)
  } catch (error) {
    console.error('Error fetching questions:', error)
    res.status(500).json({ error: 'Failed to fetch questions' })
  }
})

// Submit a question
router.post('/', async (req, res) => {
  try {
    const { sessionId, userId, text, isAnonymous } = req.body

    if (!sessionId || !userId || !text) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Get session settings to check if moderation is enabled
    const sessionResult = await query(
      'SELECT settings FROM sessions WHERE id = $1',
      [sessionId]
    )

    if (sessionResult.length === 0) {
      return res.status(404).json({ error: 'Session not found' })
    }

    const settings = sessionResult[0].settings
    const initialStatus = settings.moderation_enabled ? 'pending' : 'approved'

    const result = await query<Question>(
      `INSERT INTO questions (session_id, user_id, text, is_anonymous, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [sessionId, userId, text, isAnonymous, initialStatus]
    )

    res.status(201).json(result[0])
  } catch (error) {
    console.error('Error submitting question:', error)
    res.status(500).json({ error: 'Failed to submit question' })
  }
})

// Vote on a question
router.post('/:questionId/vote', async (req, res) => {
  try {
    const { questionId } = req.params
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    await transaction(async (client) => {
      // Insert vote
      await client.query(
        'INSERT INTO question_votes (user_id, question_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [userId, questionId]
      )

      // Update question votes count
      await client.query(
        'UPDATE questions SET votes = (SELECT COUNT(*) FROM question_votes WHERE question_id = $1) WHERE id = $1',
        [questionId]
      )
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error voting on question:', error)
    res.status(500).json({ error: 'Failed to vote on question' })
  }
})

// Unvote on a question
router.delete('/:questionId/vote', async (req, res) => {
  try {
    const { questionId } = req.params
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    await transaction(async (client) => {
      // Delete vote
      await client.query(
        'DELETE FROM question_votes WHERE user_id = $1 AND question_id = $2',
        [userId, questionId]
      )

      // Update question votes count
      await client.query(
        'UPDATE questions SET votes = (SELECT COUNT(*) FROM question_votes WHERE question_id = $1) WHERE id = $1',
        [questionId]
      )
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error unvoting on question:', error)
    res.status(500).json({ error: 'Failed to unvote on question' })
  }
})

// Update question status (for moderation)
router.patch('/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params
    const { status, answer } = req.body

    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`)
      values.push(status)
    }
    if (answer !== undefined) {
      updates.push(`answer = $${paramIndex++}`)
      values.push(answer)
      updates.push(`answered_at = NOW()`)
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    values.push(questionId)
    const result = await query<Question>(
      `UPDATE questions SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )

    if (result.length === 0) {
      return res.status(404).json({ error: 'Question not found' })
    }

    res.json(result[0])
  } catch (error) {
    console.error('Error updating question:', error)
    res.status(500).json({ error: 'Failed to update question' })
  }
})

// Delete question
router.delete('/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params

    await query('DELETE FROM questions WHERE id = $1', [questionId])

    res.status(204).send()
  } catch (error) {
    console.error('Error deleting question:', error)
    res.status(500).json({ error: 'Failed to delete question' })
  }
})

export default router
