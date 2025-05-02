import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import pollRoutes from './routes/poll.routes.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/polls', pollRoutes)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB')
    app.listen(port, () => console.log(`🚀 Servidor rodando na porta ${port}`))
  })
  .catch(err => console.error('Erro ao conectar no MongoDB:', err))
