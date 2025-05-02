import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pollRoutes from './routes/poll.routes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/polls', pollRoutes)

export default app
