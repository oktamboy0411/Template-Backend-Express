import cron from 'node-cron'

import { UploadController } from '@/modules'

export const cronJobs = (): void => {
   cron.schedule('59 23 * * *', () => {
      UploadController.deleteFileWithCron()
         .then((deletedFiles) => {
            console.info(
               `${deletedFiles} file(s) deleted in S3 Bucket! Date: ${new Date().toString()}`,
            )
         })
         .catch((error) => {
            console.error('Error deleting files:', error)
         })
   })
}
