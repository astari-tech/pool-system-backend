import express from 'express'
import { createPoll, getPolls, getPollById, voteOnPoll } from '../services/poll.service.js'
import { validate } from '../middlewares/validate.js'
import {
  CreatePollSchema,
  VotePollSchema,
  PollIdParamSchema,
  PollListQuerySchema
} from '../schemas/poll.schema.js'
import { handleError } from '../utils/handle-error.js'
import { handleSuccess } from '../utils/handle-success.js'

const router = express.Router()

router.post('/', validate({ body: CreatePollSchema }), async (req, res) => {
  const { title, options } = req.body
  const poll = await createPoll(title, options)
  handleSuccess(res, poll, 201)
})

router.get('/', validate({ query: PollListQuerySchema }), async (req, res) => {
  const result = await getPolls(req.query)
  handleSuccess(res, result)
})

router.get('/active', async (req, res) => {
  const now = new Date()
  const polls = await Poll.find({
    $or: [{ expiresAt: { $gt: now } }, { expiresAt: null }]
  }).sort({ createdAt: -1 })

  handleSuccess(res, polls, 201)
})

router.get('/:id', validate({ params: PollIdParamSchema }), async (req, res) => {
  const { id } = req.params
  const poll = await getPollById(id)
  if (!poll) {
    return res.status(404).json({ error: 'Enquete não encontrada' })
  }
  handleSuccess(res, poll, 201)
})

router.post(
  '/:id/vote',
  validate({ params: PollIdParamSchema, body: VotePollSchema }),
  async (req, res) => {
    try {
      const { id } = req.params
      const { optionIndex } = req.body
      const updated = await voteOnPoll(id, optionIndex)
      handleSuccess(res, updated)
    } catch (err) {
      return handleError(err, res)
    }
  }
)

export default router
