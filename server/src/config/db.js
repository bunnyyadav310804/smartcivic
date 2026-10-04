import mongoose from 'mongoose'

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rajashekar'

  try {
    await mongoose.connect(mongoUri)
    console.log(`MongoDB connected: ${mongoose.connection.host}`)
    return mongoose.connection
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    return null
  }
}
