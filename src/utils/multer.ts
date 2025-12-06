import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import multer from 'multer'
import path from 'node:path'

import { HttpException } from './http.exception'

const ALLOWED_FILE_TYPES = /jpeg|png|jpg|avif|webp|pdf/
const FILE_SIZE_MB = 50
const BYTES_PER_KB = 1024
const BYTES_PER_MB = BYTES_PER_KB * BYTES_PER_KB
const MAX_FILE_SIZE = FILE_SIZE_MB * BYTES_PER_MB

const checkFileType = (
   file: Express.Multer.File,
   cb: multer.FileFilterCallback,
): void => {
   const extname = ALLOWED_FILE_TYPES.test(
      path.extname(file.originalname).toLowerCase(),
   )
   const mimetype = ALLOWED_FILE_TYPES.test(file.mimetype)

   if (mimetype && extname) {
      cb(null, true)
   } else {
      cb(
         new HttpException(
            StatusCodes.UNPROCESSABLE_ENTITY,
            ReasonPhrases.UNPROCESSABLE_ENTITY,
            `Only jpeg, png, jpg, avif, webp, pdf files are allowed. Max size ${FILE_SIZE_MB} MB.`,
         ),
      )
   }
}

export const upload = multer({
   storage: multer.memoryStorage(),
   limits: { fileSize: MAX_FILE_SIZE },
   fileFilter: (req, file, cb) => {
      checkFileType(file, cb)
   },
})
