import express from 'express'
import { createPoll, getPolls, getPollById, voteOnPoll } from '../services/poll.service.js'
import { validate } from '../middlewares/validate.js'
import {
  CreatePollSchema,
  VotePollSchema,
  PollIdParamSchema,
  PollListQuerySchema
} from '../schemas/poll.schema.js'

const router = express.Router()

router.post('/', validate({ body: CreatePollSchema }), async (req, res) => {
  const { title, options } = req.body
  const poll = await createPoll(title, options)
  res.status(201).json(poll)
})

router.get('/', validate({ query: PollListQuerySchema }), async (req, res) => {
  const result = await getPolls(req.query)
  res.json(result)
})

router.get('/active', async (req, res) => {
  const now = new Date()
  const polls = await Poll.find({
    $or: [{ expiresAt: { $gt: now } }, { expiresAt: null }]
  }).sort({ createdAt: -1 })

  res.json(polls)
})

router.get('/:id', validate({ params: PollIdParamSchema }), async (req, res) => {
  const { id } = req.params
  const poll = await getPollById(id)
  if (!poll) {
    return res.status(404).json({ error: 'Enquete não encontrada' })
  }
  res.json(poll)
})

router.post(
  '/:id/vote',
  validate({ params: PollIdParamSchema, body: VotePollSchema }),
  async (req, res) => {
    const { id } = req.params
    const { optionIndex } = req.body
    const updated = await voteOnPoll(id, optionIndex)
    res.json(updated)
  }
)

export default router
