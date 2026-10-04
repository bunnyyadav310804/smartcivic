import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function protectRoute(request, response, next) {
  const authorizationHeader = request.headers.authorization

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Not authorized, token missing' })
  }

  try {
    const token = authorizationHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret')
    const user = await User.findById(decoded.id)

    if (!user) {
      return response.status(401).json({ message: 'Not authorized, user not found' })
    }

    request.user = user
    return next()
  } catch (_error) {
    return response.status(401).json({ message: 'Not authorized, token invalid' })
  }
}