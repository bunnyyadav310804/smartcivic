import { Router } from 'express'
import { getUsers, login, me, register } from '../controllers/authController.js'
import { protectRoute } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', protectRoute, me)
router.get('/users', protectRoute, getUsers)

export default router