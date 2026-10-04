import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import {
	addFeedback,
	checkDuplicates,
	create,
	details,
	list,
	remove,
	removeUpvoteHandler,
	statistics,
	update,
	updateStatus,
	upvote
} from '../controllers/complaintController.js'
import { protectRoute } from '../middleware/authMiddleware.js'

const router = Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadDirectory = path.resolve(__dirname, '../../uploads/complaints')

const storage = multer.diskStorage({
	destination: (_request, _file, callback) => callback(null, uploadDirectory),
	filename: (_request, file, callback) => {
		const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
		callback(null, uniqueName)
	}
})

const upload = multer({ storage })
const uploadFields = upload.fields([
	{ name: 'images', maxCount: 10 },
	{ name: 'resolutionImages', maxCount: 10 }
])

router.use(protectRoute)

router.post('/', uploadFields, create)
router.post('/check-duplicates', checkDuplicates)
router.get('/', list)
router.get('/dashboard/stats', statistics)
router.get('/:id', details)
router.put('/:id', uploadFields, update)
router.patch('/:id/status', uploadFields, updateStatus)
router.post('/:id/feedback', addFeedback)
router.post('/:id/upvote', upvote)
router.delete('/:id/upvote', removeUpvoteHandler)
router.delete('/:id', remove)

export default router