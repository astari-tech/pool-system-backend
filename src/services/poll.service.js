import Poll from '../models/poll.model.js'

export async function createPoll(title, options, expiresAt = null) {
  const poll = new Poll({
    title,
    options: options.map((text) => ({ text })),
    expiresAt
  })
  await poll.save()
  return poll
}

export async function getPolls({ page = 1, limit = 10, title, order = 'desc' } = {}) {
  const skip = (page - 1) * limit

  const filter = {}
  if (title) {
    filter.title = { $regex: title, $options: 'i' }
  }

  const sortOrder = order === 'asc' ? 1 : -1

  const [polls, total] = await Promise.all([
    Poll.find(filter).skip(skip).limit(limit).sort({ createdAt: sortOrder }),
    Poll.countDocuments(filter)
  ])

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    order,
    data: polls
  }
}

export async function getPollById(id) {
  return Poll.findById(id)
}

export async function voteOnPoll(id, optionIndex) {
  const poll = await Poll.findById(id)
  if (!poll || optionIndex == null || optionIndex >= poll.options.length) {
    throw new Error('Enquete ou opção inválida')
  }
  poll.options[optionIndex].votes += 1
  await poll.save()
  return poll
}
