import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import app from '../src/app.js'

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri(), { dbName: 'test' })
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop()
})

describe('Poll Routes', () => {
  it('deve criar e retornar uma enquete', async () => {
    const res = await request(app)
      .post('/polls')
      .send({
        title: 'Melhor linguagem?',
        options: ['JS', 'TS']
      })

    expect(res.statusCode).toBe(201)
    expect(res.body.data).toHaveProperty('_id')
    expect(res.body.data.options).toHaveLength(2)
  })

  it('deve listar as enquetes existentes', async () => {
    const res = await request(app).get('/polls')
    expect(res.statusCode).toBe(200)
    expect(res.body.data).toHaveProperty('data')
    expect(Array.isArray(res.body.data.data)).toBe(true)
  })

  it('deve votar em uma opção da enquete', async () => {
    // 1. Criar uma enquete primeiro
    const createRes = await request(app)
      .post('/polls')
      .send({
        title: 'Editor favorito?',
        options: ['VSCode', 'Vim']
      })

    const pollId = createRes.body.data._id

    // 2. Votar na opção 0 (VSCode)
    const voteRes = await request(app).post(`/polls/${pollId}/vote`).send({ optionIndex: 0 })

    expect(voteRes.statusCode).toBe(200)
    expect(voteRes.body.data.options[0].votes).toBe(1)
  })

  it('deve retornar erro ao votar com optionIndex inválido', async () => {
    const createRes = await request(app)
      .post('/polls')
      .send({
        title: 'Qual terminal você usa?',
        options: ['Terminal padrão', 'Hyper']
      })

    const pollId = createRes.body._id

    const res = await request(app).post(`/polls/${pollId}/vote`).send({ optionIndex: 5 })

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('deve retornar erro ao votar em uma enquete que não existe', async () => {
    const fakeId = 'aaaaaaaaaaaaaaaaaaaaaaaa'

    const res = await request(app).post(`/polls/${fakeId}/vote`).send({ optionIndex: 0 })

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')
  })
})
