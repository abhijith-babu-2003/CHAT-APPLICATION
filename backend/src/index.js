import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectDB } from '../lib/db.js'
import cors from 'cors'
import { app, server } from '../lib/socket.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename) 

dotenv.config()

import authRoutes from '../routes/auth.route.js'
import messageRoutes from '../routes/message.route.js'

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser())

const PORT = process.env.PORT || 10000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend', 'dist', 'index.html'))
  })
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  connectDB()
})