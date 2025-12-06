import {
   DeleteObjectCommand,
   HeadObjectCommand,
   S3Client,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

import {
   AWS_S3_ACCESS_KEY_ID,
   AWS_S3_BUCKET_FOLDER,
   AWS_S3_BUCKET_NAME,
   AWS_S3_REGION,
   AWS_S3_SECRET_ACCESS_KEY,
   AWS_S3_URL,
} from './secrets'

const STATUS_OK = 200

const s3Client = new S3Client({
   region: AWS_S3_REGION,
   credentials: {
      accessKeyId: AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
   },
   endpoint: AWS_S3_URL,
})

const uploadFile = async (
   buffer: Buffer,
   key: string,
): Promise<string | undefined> => {
   try {
      const upload = new Upload({
         client: s3Client,
         params: {
            Bucket: AWS_S3_BUCKET_NAME,
            Key: AWS_S3_BUCKET_FOLDER + key,
            Body: buffer,
         },
      })

      const data = await upload.done()

      if (data.$metadata.httpStatusCode === STATUS_OK) {
         return data.Location
      }
   } catch (error) {
      const message =
         error instanceof Error ? error.message : 'Failed to upload file'
      throw new Error(`Error uploading file: ${message}`)
   }
}

const deleteFile = async (location: string): Promise<void> => {
   if (location === '') {
      return
   }

   try {
      const key = location.split(AWS_S3_BUCKET_FOLDER)[1]
      await s3Client.send(
         new DeleteObjectCommand({
            Bucket: AWS_S3_BUCKET_NAME,
            Key: AWS_S3_BUCKET_FOLDER + key,
         }),
      )
   } catch (error) {
      const message =
         error instanceof Error ? error.message : 'Failed to delete file'
      throw new Error(`Error deleting file: ${message}`)
   }
}

const checkFileExists = async (location: string): Promise<boolean> => {
   if (location === '') {
      return false
   }

   try {
      const key = location.split(AWS_S3_BUCKET_FOLDER)[1]
      await s3Client.send(
         new HeadObjectCommand({
            Bucket: AWS_S3_BUCKET_NAME,
            Key: AWS_S3_BUCKET_FOLDER + key,
         }),
      )
      return true
   } catch (error) {
      if (error instanceof Error && error.name === 'NotFound') {
         return false
      }
      const message =
         error instanceof Error ? error.message : 'Failed to check file'
      throw new Error(`Error checking file existence: ${message}`)
   }
}

export { checkFileExists, deleteFile, uploadFile }
