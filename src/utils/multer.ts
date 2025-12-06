import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import multer from 'multer'
import path from 'path'

import { HttpException } from './http.exception'

const checkFileType = (
   file: Express.Multer.File,
   cb: multer.FileFilterCallback,
) => {
   const filetypes = /jpeg|png|jpg|avif|webp|pdf/
   const extname = filetypes.test(
      path.extname(file.originalname)?.toLowerCase(),
   )
   const mimetype = filetypes.test(file.mimetype)

   if (mimetype && extname) {
      cb(null, true)
   } else {
      cb(
         new HttpException(
            StatusCodes.UNPROCESSABLE_ENTITY,
            ReasonPhrases.UNPROCESSABLE_ENTITY,
            'You can only upload image! Max size 50 MB!',
         ),
      )
   }
}

export const upload = multer({
   storage: multer.memoryStorage(),
   limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
   fileFilter: (req, file, cb) => {
      checkFileType(file, cb)
   },
})
