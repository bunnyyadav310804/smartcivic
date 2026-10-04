import 'dotenv/config'
import app from './app.js'

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured in production')
}

const port = Number(process.env.PORT) || 5005

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

