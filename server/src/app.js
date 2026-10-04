import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import apiRouter from './routes/api.js'
import authRouter from './routes/authRoutes.js'
import complaintRouter from './routes/complaintRoutes.js'
import healthRouter from './routes/healthRoutes.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsPath = path.resolve(__dirname, '../uploads/complaints')

fs.mkdirSync(uploadsPath, { recursive: true })

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
  })
)
app.use(express.json())
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')))

app.get('/', (_request, response) => {
  response.json({ message: 'Express server is running' })
})

app.use('/api', healthRouter)
app.use('/api', apiRouter)
app.use('/api/auth', authRouter)
app.use('/api/complaints', complaintRouter)

export default app
