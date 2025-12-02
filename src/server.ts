import 'core-js/stable'
import 'module-alias/register'
import 'regenerator-runtime/runtime'

import { App } from './app'
import { CronJobs } from './utils'
import { PORT } from './utils/secrets'

CronJobs()

const { app } = new App()

app.listen(PORT, (error: any) => {
   if (!error) {
      console.info(`⚡️[server]: http://localhost:${PORT}`)
      return
   }

   if (error.syscall !== 'listen') {
      throw error
   }

   switch (error.code) {
      case 'EACCES':
         console.error(`Port ${PORT} requires elevated privileges`)
         process.exit(1)
      case 'EADDRINUSE':
         console.error(
            `Port ${PORT} is already in use! \n netstat -aon | findstr :${PORT} \n taskkill /PID 1234 /F`,
         )
         process.exit(1)
      default:
         throw error
   }
})
