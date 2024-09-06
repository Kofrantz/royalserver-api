import { Router } from 'express'
import { example } from '../controllers/apiControllers/example'
import { auth } from '../middleware/auth'
import { getVersions } from '../controllers/apiControllers/versions'
import { createServer } from '../controllers/apiControllers/server'

const router = Router()

router.get('/example', auth, example)
router.get('/versions', auth, getVersions)
router.post('/server', auth, createServer)

export default router
