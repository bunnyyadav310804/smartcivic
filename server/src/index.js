import 'dotenv/config'
import app from './app.js'
import { connectDatabase } from './config/db.js'
import { seedDefaultAdmin } from './config/seedAdmin.js'

const port = Number(process.env.PORT) || 5005

await connectDatabase()
await seedDefaultAdmin()

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

