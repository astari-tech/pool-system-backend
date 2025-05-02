import app from './app.js'
import mongoose from 'mongoose'

const port = process.env.PORT || 3000

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB conectado')
    app.listen(port, () => {
      console.log(`🚀 Servidor rodando na porta ${port}`)
    })
  })
  .catch(console.error)
