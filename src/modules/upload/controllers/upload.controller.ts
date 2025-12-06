import { exec } from 'child_process'
import fs from 'fs'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import path from 'path'
import sharp from 'sharp'
import { v4 } from 'uuid'

import { HttpException, asyncHandler, deleteFile, uploadFile } from '@/utils'

import { uploadModel } from '../models/upload.model'

export class UploadController {
   public static uploadFile = asyncHandler(async (req, res) => {
      const uploadedFile = req.file
      if (!uploadedFile) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            'File not provided',
         )
      }

      let processedBuffer: Buffer | undefined
      let fileKey: string | undefined

      if (uploadedFile.mimetype.split('/')[0] === 'image') {
         processedBuffer = await sharp(uploadedFile.buffer)
            .rotate()
            .toFormat('webp')
            .toBuffer()
         fileKey = `image/${v4()}.webp`
      }

      if (uploadedFile.mimetype === 'application/pdf') {
         // sudo apt install ghostscript
         if (!fs.existsSync('./public/uploads')) {
            fs.mkdirSync('./public/uploads', { recursive: true })
         }

         const inputPath = path.join(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            'public',
            'uploads',
            `${v4()}.pdf`,
         )
         const outputPath = path.join(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            'public',
            'uploads',
            `${v4()}.pdf`,
         )

         fs.writeFileSync(inputPath, uploadedFile.buffer)

         const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputPath} ${inputPath}`

         await new Promise<void>((resolve, reject) => {
            exec(gsCommand, (error) => {
               if (error) {
                  console.error('Error compressing PDF:', error)
                  reject(
                     new HttpException(
                        StatusCodes.INTERNAL_SERVER_ERROR,
                        ReasonPhrases.INTERNAL_SERVER_ERROR,
                        'Error compressing PDF',
                     ),
                  )
               }
               processedBuffer = fs.readFileSync(outputPath)
               fs.unlinkSync(inputPath)
               fs.unlinkSync(outputPath)
               fileKey = `document/${v4()}.pdf`
               resolve()
            })
         })
      }

      if (!fileKey || !processedBuffer) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            'File not upload',
         )
      }

      const filePath = await uploadFile(processedBuffer, fileKey)

      if (!filePath) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            'File not upload',
         )
      }

      await uploadModel.create({ filePath, user: req.user?._id })

      res.status(StatusCodes.CREATED).json({
         success: true,
         filePath,
      })
   })

   public static uploadFiles = asyncHandler(async (req, res) => {
      const uploadedFiles = req.files as Express.Multer.File[]
      if (!uploadedFiles || uploadedFiles.length === 0) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            'Files not provided',
         )
      }

      const fileResults = await Promise.all(
         uploadedFiles.map(async (uploadedFile) => {
            let processedBuffer: Buffer | undefined
            let fileKey: string | undefined

            if (uploadedFile.mimetype.split('/')[0] === 'image') {
               processedBuffer = await sharp(uploadedFile.buffer)
                  .rotate()
                  .toFormat('webp')
                  .toBuffer()
               fileKey = `image/${v4()}.webp`
            }

            if (uploadedFile.mimetype === 'application/pdf') {
               if (!fs.existsSync('./public/uploads')) {
                  fs.mkdirSync('./public/uploads', { recursive: true })
               }

               const inputPath = path.join(
                  __dirname,
                  '..',
                  '..',
                  '..',
                  '..',
                  'public',
                  'uploads',
                  `${v4()}.pdf`,
               )
               const outputPath = path.join(
                  __dirname,
                  '..',
                  '..',
                  '..',
                  '..',
                  'public',
                  'uploads',
                  `${v4()}.pdf`,
               )

               fs.writeFileSync(inputPath, uploadedFile.buffer)

               const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputPath} ${inputPath}`

               await new Promise<void>((resolve, reject) => {
                  exec(gsCommand, (error) => {
                     if (error) {
                        console.error('Error compressing PDF:', error)
                        reject(
                           new HttpException(
                              StatusCodes.INTERNAL_SERVER_ERROR,
                              ReasonPhrases.INTERNAL_SERVER_ERROR,
                              'Error compressing PDF',
                           ),
                        )
                     }
                     processedBuffer = fs.readFileSync(outputPath)
                     fs.unlinkSync(inputPath)
                     fs.unlinkSync(outputPath)
                     fileKey = `document/${v4()}.pdf`
                     resolve()
                  })
               })
            }

            if (!fileKey || !processedBuffer) {
               return null
            }

            const filePath = await uploadFile(processedBuffer, fileKey)
            if (!filePath) {
               return null
            }

            await uploadModel.create({ filePath, user: req.user?._id })
            return filePath
         }),
      )

      const filteredResults = fileResults.filter(Boolean)

      if (filteredResults.length === 0) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            'Files not uploaded',
         )
      }

      res.status(StatusCodes.CREATED).json({
         success: true,
         file_paths: filteredResults,
      })
   })

   public static deleteFileWithCron = async (): Promise<string> => {
      try {
         const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
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
      } catch (error) {
         console.error(error)
         return 'Not'
      }
   }
}
