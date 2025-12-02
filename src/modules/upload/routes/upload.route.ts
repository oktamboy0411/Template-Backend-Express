import { authMiddleware, upload } from '@/utils'

import { Router } from 'express'

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
