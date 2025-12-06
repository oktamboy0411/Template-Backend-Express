import { Router } from 'express'

import { authMiddleware } from '@/middlewares'
import { upload } from '@/utils'

import { UploadController } from '../controllers/upload.controller'

const uploadRouter = Router()

uploadRouter.post(
   '/file',
   authMiddleware,
   upload.single('file'),
   UploadController.uploadFile,
)

uploadRouter.post(
   '/files',
   authMiddleware,
   upload.array('files', 10),
   UploadController.uploadFiles,
)

export { uploadRouter }
