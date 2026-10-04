import mongoose from 'mongoose'

let connectionPromise

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI || (
    process.env.NODE_ENV === 'production' ? '' : 'mongodb://127.0.0.1:27017/rajashekar'
  )

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured for this deployment')
  }

  if (mongoose.connection.readyState === 1) return mongoose.connection

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000
    }).then(() => {
      console.log(`MongoDB connected: ${mongoose.connection.host}`)
      return mongoose.connection
    }).catch((error) => {
      connectionPromise = undefined
      throw new Error(`MongoDB connection failed: ${error.message}`)
    })
  }

  return connectionPromise
}
