import jwt from 'jsonwebtoken'
import User from '../models/User.js'

function createToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'dev_jwt_secret', {
    expiresIn: '7d'
  })
}

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt
  }
}

export async function registerUser({ name, email, phone, password, role }) {
  const normalizedEmail = email.toLowerCase().trim()

  const existingUser = await User.findOne({ email: normalizedEmail })
  if (existingUser) {
    const error = new Error('Email already exists')
    error.statusCode = 400
    throw error
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    password,
    role
  })

  return {
    token: createToken(user._id),
    user: serializeUser(user)
  }
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.toLowerCase().trim()

  const user = await User.findOne({ email: normalizedEmail }).select('+password')
  if (!user) {
    const error = new Error('Invalid email or password')
    error.statusCode = 401
    throw error
  }

  const isPasswordValid = await user.comparePassword(password)
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password')
    error.statusCode = 401
    throw error
  }

  return {
    token: createToken(user._id),
    user: serializeUser(user)
  }
}

export async function getUserById(userId) {
  return User.findById(userId)
}

export async function getAllUsers() {
  const users = await User.find({}).sort({ createdAt: -1 }).select('-password')

  return users.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt
  }))
}
