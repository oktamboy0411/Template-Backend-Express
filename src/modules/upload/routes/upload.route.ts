import { Router } from 'express'

import { checkUser, verifyToken } from '@/middlewares'
import { upload } from '@/utils'

import { UploadController } from '../controllers/upload.controller'

const uploadRouter = Router()

uploadRouter.post(
   '/file',
   verifyToken,
   checkUser,
   upload.single('file'),
   UploadController.uploadFile,
)

uploadRouter.post(
   '/files',
   verifyToken,
   checkUser,
   upload.array('files', 10),
   UploadController.uploadFiles,
)

export { uploadRouter }
