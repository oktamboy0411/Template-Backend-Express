import type { Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { v4 } from 'uuid'

import type { ICustomRequest } from '@/types'
import { HttpException, asyncHandler, deleteFile, uploadFile } from '@/utils'

import { uploadModel } from '../models/upload.model'

const IMAGE_TYPE = 'image'
const PDF_MIME_TYPE = 'application/pdf'
const WEBP_FORMAT = 'webp'
const IMAGE_KEY_PREFIX = 'image'
const DOCUMENT_KEY_PREFIX = 'document'
const UPLOADS_DIR = './public/uploads'
const HOURS_PER_DAY = 24
const MINUTES_PER_HOUR = 60
const SECONDS_PER_MINUTE = 60
const MILLISECONDS_PER_SECOND = 1000
const MILLISECONDS_PER_DAY =
   HOURS_PER_DAY *
   MINUTES_PER_HOUR *
   SECONDS_PER_MINUTE *
   MILLISECONDS_PER_SECOND
const PARENT_DIR_COUNT = 4

const ERROR_MESSAGES = {
   FILE_NOT_PROVIDED: 'File not provided',
   FILES_NOT_PROVIDED: 'Files not provided',
   FILE_NOT_UPLOADED: 'File not upload',
   FILES_NOT_UPLOADED: 'Files not uploaded',
   PDF_COMPRESSION_ERROR: 'Error compressing PDF',
} as const

const GS_COMMAND_TEMPLATE = (outputPath: string, inputPath: string): string =>
   `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputPath} ${inputPath}`

const ensureUploadsDirectory = (): void => {
   if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true })
   }
}

const generateTempPath = (filename: string): string =>
   path.join(
      __dirname,
      ...Array(PARENT_DIR_COUNT).fill('..'),
      'public',
      'uploads',
      filename,
   )

const processImage = (buffer: Buffer): Promise<Buffer> =>
   sharp(buffer).rotate().toFormat(WEBP_FORMAT).toBuffer()

const compressPdf = (inputBuffer: Buffer): Promise<Buffer> => {
   ensureUploadsDirectory()

   const inputPath = generateTempPath(`${v4()}.pdf`)
   const outputPath = generateTempPath(`${v4()}.pdf`)

   fs.writeFileSync(inputPath, inputBuffer)

   const gsCommand = GS_COMMAND_TEMPLATE(outputPath, inputPath)

   return new Promise<Buffer>((resolve, reject) => {
      exec(gsCommand, (error) => {
         if (error !== null) {
            fs.unlinkSync(inputPath)
            if (fs.existsSync(outputPath)) {
               fs.unlinkSync(outputPath)
            }
            reject(
               new HttpException(
                  StatusCodes.INTERNAL_SERVER_ERROR,
                  ReasonPhrases.INTERNAL_SERVER_ERROR,
                  ERROR_MESSAGES.PDF_COMPRESSION_ERROR,
               ),
            )
            return
         }

         const processedBuffer = fs.readFileSync(outputPath)
         fs.unlinkSync(inputPath)
         fs.unlinkSync(outputPath)
         resolve(processedBuffer)
      })
   })
}

const processUploadedFile = async (
   uploadedFile: Express.Multer.File,
): Promise<{ buffer: Buffer; key: string } | null> => {
   const mimeType = uploadedFile.mimetype
   const fileType = mimeType.split('/')[0]

   if (fileType === IMAGE_TYPE) {
      const buffer = await processImage(uploadedFile.buffer)
      const key = `${IMAGE_KEY_PREFIX}/${v4()}.${WEBP_FORMAT}`
      return { buffer, key }
   }

   if (mimeType === PDF_MIME_TYPE) {
      const buffer = await compressPdf(uploadedFile.buffer)
      const key = `${DOCUMENT_KEY_PREFIX}/${v4()}.pdf`
      return { buffer, key }
   }

   return null
}

export class UploadController {
   public static uploadFile = asyncHandler(
      async (req: ICustomRequest, res: Response) => {
         const uploadedFile = req.file

         if (uploadedFile === undefined) {
            throw new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               ERROR_MESSAGES.FILE_NOT_PROVIDED,
            )
         }

         const processed = await processUploadedFile(uploadedFile)

         if (processed === null) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               ERROR_MESSAGES.FILE_NOT_UPLOADED,
            )
         }

         const filePath = await uploadFile(processed.buffer, processed.key)

         if (filePath === '') {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               ERROR_MESSAGES.FILE_NOT_UPLOADED,
            )
         }

         await uploadModel.create({ filePath, user: req.user?._id })

         res.status(StatusCodes.CREATED).json({
            success: true,
            filePath,
         })
      },
   )

   public static uploadFiles = asyncHandler(
      async (req: ICustomRequest, res: Response) => {
         const uploadedFiles = req.files as Express.Multer.File[]

         if (uploadedFiles.length === 0) {
            throw new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               ERROR_MESSAGES.FILES_NOT_PROVIDED,
            )
         }

         const fileResults = await Promise.all(
            uploadedFiles.map(async (uploadedFile) => {
               const processed = await processUploadedFile(uploadedFile)

               if (processed === null) {
                  return null
               }

               const filePath = await uploadFile(
                  processed.buffer,
                  processed.key,
               )

               if (filePath === '') {
                  return null
               }

               await uploadModel.create({ filePath, user: req.user?._id })
               return filePath
            }),
         )

         const filteredResults = fileResults.filter(
            (result): result is string => result !== null,
         )

         if (filteredResults.length === 0) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               ERROR_MESSAGES.FILES_NOT_UPLOADED,
            )
         }

         res.status(StatusCodes.CREATED).json({
            success: true,
            file_paths: filteredResults,
         })
      },
   )

   public static deleteFileWithCron = async (): Promise<string> => {
      try {
         const oneDayAgo = new Date(Date.now() - MILLISECONDS_PER_DAY)
         const files = (
            await uploadModel.find(
               { is_use: false, created_at: { $lt: oneDayAgo } },
               null,
               { lean: true },
            )
         ).map((item) => item.filePath)

         for (const item of files) {
            void deleteFile(item)
            await uploadModel.deleteOne({ filePath: item })
         }

         return files.length.toString()
      } catch {
         return 'Not'
      }
   }
}
