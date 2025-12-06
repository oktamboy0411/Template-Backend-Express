/* eslint-disable no-console */
import cron from 'node-cron'

import { UploadController } from '@/modules'

export const cronJobs = (): void => {
   cron.schedule(
      '59 23 * * *',
      async (): Promise<void> => {
         try {
            const deletedFiles = await UploadController.deleteFileWithCron()
            console.info(
               `[CRON] Successfully deleted ${deletedFiles} file(s) from S3 Bucket at ${new Date().toISOString()}`,
            )
         } catch (error) {
            console.error(
               '[CRON] Error during file deletion:',
               error instanceof Error ? error.message : error,
            )
         }
      },
      {
         timezone: 'Asia/Tashkent',
      },
   )

   console.info('[CRON] Cron jobs initialized successfully')
}
