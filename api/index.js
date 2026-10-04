import 'dotenv/config'
import app from '../server/src/app.js'
import { connectDatabase } from '../server/src/config/db.js'
import { seedDefaultAdmin } from '../server/src/config/seedAdmin.js'

let initialized = false

async function ensureRuntime() {
  if (initialized) return

  await connectDatabase()
  await seedDefaultAdmin()
  initialized = true
}

app.use(async (request, response, next) => {
  try {
    await ensureRuntime()
    next()
  } catch (error) {
    console.error('API initialization failed:', error)
    response.status(500).json({ message: 'Server initialization failed' })
  }
})

export default app
