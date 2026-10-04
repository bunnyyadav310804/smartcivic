import mongoose from 'mongoose'

export function getHealthStatus() {
  return {
    message: 'Backend is running',
    mongodb: {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState
    },
    environment: process.env.NODE_ENV || 'development'
  }
}