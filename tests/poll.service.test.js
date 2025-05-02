import { describe, it, expect } from '@jest/globals'
import { createPoll } from '../src/services/poll.service.js'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

// Setup e teardown do banco em memória
let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri(), { dbName: 'test' })
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop() // <- isso fecha corretamente a instância
})

describe('Poll Service', () => {
  it('deve criar uma enquete com título e opções', async () => {
    const poll = await createPoll('Qual linguagem?', ['JavaScript', 'TypeScript'])

    expect(poll).toHaveProperty('_id')
    expect(poll.title).toBe('Qual linguagem?')
    expect(poll.options.length).toBe(2)
  })
})
