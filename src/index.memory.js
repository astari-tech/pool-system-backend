import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import pollRoutes from './routes/poll.routes.js'
import { MongoMemoryServer } from 'mongodb-memory-server'

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/polls', pollRoutes)

const startServer = async () => {
  const mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()

  mongoose.connect(uri)
    .then(() => {
      console.log('✅ MongoDB em memória conectado')
      app.listen(port, () => console.log(`🚀 Servidor rodando na porta ${port}`))
    })
    .catch(err => console.error('Erro ao conectar no MongoDB:', err))
}

startServer()
