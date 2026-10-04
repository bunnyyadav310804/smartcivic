import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import apiRouter from './routes/api.js'
import authRouter from './routes/authRoutes.js'
import complaintRouter from './routes/complaintRoutes.js'
import healthRouter from './routes/healthRoutes.js'
import { connectDatabase } from './config/db.js'
import { seedDefaultAdmin } from './config/seedAdmin.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../..')
const clientDistPath = path.join(projectRoot, 'client', 'dist')
const uploadsPath = path.resolve(__dirname, '../uploads/complaints')
let runtimeInitialization

fs.mkdirSync(uploadsPath, { recursive: true })

async function ensureRuntimeInitialized() {
  if (!runtimeInitialization) {
    runtimeInitialization = connectDatabase()
      .then(() => seedDefaultAdmin())
      .catch((error) => {
        runtimeInitialization = undefined
        throw error
      })
  }

  return runtimeInitialization
}

app.use(
  cors({
    origin: true,
    credentials: true
  })
)
app.use(express.json())
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')))

app.use('/api', async (_request, response, next) => {
  try {
    await ensureRuntimeInitialized()
    next()
  } catch (error) {
    console.error('API initialization failed:', error.message)
    response.status(503).json({ message: error.message })
  }
})

app.use('/api', healthRouter)
app.use('/api', apiRouter)
app.use('/api/auth', authRouter)
app.use('/api/complaints', complaintRouter)

app.use(express.static(clientDistPath))

app.get('/', (_request, response) => {
  response.json({ message: 'Express server is running' })
})

app.get('*', (request, response, next) => {
  if (/^\/(api|uploads)(\/|$)/.test(request.path)) {
    return next()
  }

  response.sendFile(path.join(clientDistPath, 'index.html'), (error) => {
    if (error) next(error)
  })
})

export default app
