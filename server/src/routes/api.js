import { Router } from 'express'
import mongoose from 'mongoose'

const router = Router()

router.get('/sample', (_request, response) => {
  response.json({
    success: true,
    message: 'Sample response from the Express backend',
    data: {
      frontend: 'Vite + React',
      backend: 'Express + Mongoose',
      databaseConnected: mongoose.connection.readyState === 1
    }
  })
})

export default router
