import { Router } from 'express'
import { query } from '../db/index.js'
import type { Poll, PollResponse } from '../types/index.js'

const router = Router()

// Get polls for a session
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { status } = req.query

    let sql = 'SELECT * FROM polls WHERE session_id = $1'
    const params: any[] = [sessionId]

    if (status) {
      sql += ' AND status = $2'
      params.push(status)
    }

    sql += ' ORDER BY created_at DESC'

    const result = await query<Poll>(sql, params)

    res.json(result)
  } catch (error) {
    console.error('Error fetching polls:', error)
    res.status(500).json({ error: 'Failed to fetch polls' })
  }
})

// Create a poll
router.post('/', async (req, res) => {
  try {
    const { sessionId, question, type, options, settings } = req.body

    if (!sessionId || !question || !type) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const result = await query<Poll>(
      `INSERT INTO polls (session_id, question, type, options, settings, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        sessionId,
        question,
        type,
        options ? JSON.stringify(options) : null,
        JSON.stringify(settings || {}),
        'draft'
      ]
    )

    res.status(201).json(result[0])
  } catch (error) {
    console.error('Error creating poll:', error)
    res.status(500).json({ error: 'Failed to create poll' })
  }
})

// Update poll (launch, close, etc.)
router.patch('/:pollId', async (req, res) => {
  try {
    const { pollId } = req.params
    const { status, question, options, settings } = req.body

    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`)
      values.push(status)
    }
    if (question !== undefined) {
      updates.push(`question = $${paramIndex++}`)
      values.push(question)
    }
    if (options !== undefined) {
      updates.push(`options = $${paramIndex++}`)
      values.push(JSON.stringify(options))
    }
    if (settings !== undefined) {
      updates.push(`settings = $${paramIndex++}`)
      values.push(JSON.stringify(settings))
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    values.push(pollId)
    const result = await query<Poll>(
      `UPDATE polls SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )

    if (result.length === 0) {
      return res.status(404).json({ error: 'Poll not found' })
    }

    res.json(result[0])
  } catch (error) {
    console.error('Error updating poll:', error)
    res.status(500).json({ error: 'Failed to update poll' })
  }
})

// Submit poll response
router.post('/:pollId/responses', async (req, res) => {
  try {
    const { pollId } = req.params
    const { userId, response } = req.body

    if (!userId || response === undefined) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const result = await query<PollResponse>(
      `INSERT INTO poll_responses (poll_id, user_id, response)
       VALUES ($1, $2, $3)
       ON CONFLICT (poll_id, user_id) DO UPDATE SET response = $3
       RETURNING *`,
      [pollId, userId, JSON.stringify(response)]
    )

    res.status(201).json(result[0])
  } catch (error) {
    console.error('Error submitting poll response:', error)
    res.status(500).json({ error: 'Failed to submit poll response' })
  }
})

// Get poll results
router.get('/:pollId/results', async (req, res) => {
  try {
    const { pollId } = req.params

    // Get poll info
    const pollResult = await query<Poll>(
      'SELECT * FROM polls WHERE id = $1',
      [pollId]
    )

    if (pollResult.length === 0) {
      return res.status(404).json({ error: 'Poll not found' })
    }

    const poll = pollResult[0]

    // Get all responses
    const responses = await query<PollResponse>(
      'SELECT * FROM poll_responses WHERE poll_id = $1',
      [pollId]
    )

    const totalResponses = responses.length

    let results: any = { totalResponses }

    // Calculate results based on poll type
    if (poll.type === 'multiple_choice') {
      const options = poll.options as string[]
      const optionCounts: Record<number, number> = {}

      responses.forEach(r => {
        const responseData = r.response as number | number[]
        const indices = Array.isArray(responseData) ? responseData : [responseData]
        indices.forEach(index => {
          optionCounts[index] = (optionCounts[index] || 0) + 1
        })
      })

      results.options = options.map((text, index) => ({
        index,
        text,
        count: optionCounts[index] || 0,
        percentage: totalResponses > 0 ? ((optionCounts[index] || 0) / totalResponses * 100) : 0
      }))
    } else if (poll.type === 'rating') {
      const ratings = responses.map(r => r.response as number)
      const average = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : 0
      results.average = average
    } else if (poll.type === 'word_cloud') {
      const wordCounts: Record<string, number> = {}
      responses.forEach(r => {
        const text = (r.response as string).toLowerCase().trim()
        wordCounts[text] = (wordCounts[text] || 0) + 1
      })
      results.wordCloud = Object.entries(wordCounts)
        .map(([text, count]) => ({ text, count }))
        .sort((a, b) => b.count - a.count)
    }

    res.json(results)
  } catch (error) {
    console.error('Error fetching poll results:', error)
    res.status(500).json({ error: 'Failed to fetch poll results' })
  }
})

// Delete poll
router.delete('/:pollId', async (req, res) => {
  try {
    const { pollId } = req.params

    await query('DELETE FROM polls WHERE id = $1', [pollId])

    res.status(204).send()
  } catch (error) {
    console.error('Error deleting poll:', error)
    res.status(500).json({ error: 'Failed to delete poll' })
  }
})

export default router
