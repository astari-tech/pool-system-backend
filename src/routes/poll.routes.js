import express from 'express'
import Poll from '../models/poll.model.js'

const router = express.Router()

router.post('/', async (req, res) => {
  const { title, options } = req.body
  if (!title || !options || !Array.isArray(options)) {
    return res.status(400).json({ error: 'Título e opções são obrigatórios' })
  }
  const poll = new Poll({
    title,
    options: options.map(text => ({ text }))
  })
  await poll.save()
  res.status(201).json(poll)
})

router.get('/', async (req, res) => {
  const polls = await Poll.find()
  res.json(polls)
})

router.get('/:id', async (req, res) => {
  const poll = await Poll.findById(req.params.id)
  if (!poll) return res.status(404).json({ error: 'Enquete não encontrada' })
  res.json(poll)
})

router.post('/:id/vote', async (req, res) => {
  const { optionIndex } = req.body
  const poll = await Poll.findById(req.params.id)
  if (!poll || optionIndex == null || optionIndex >= poll.options.length) {
    return res.status(400).json({ error: 'Enquete ou opção inválida' })
  }
  poll.options[optionIndex].votes += 1
  await poll.save()
  res.json(poll)
})

export default router
