/* eslint-disable no-console */
import 'core-js/stable'
import 'module-alias/register'
import type { Server } from 'node:http'
import 'regenerator-runtime/runtime'

import { PORT, cronJobs } from '@/utils'

import { App } from './app'

interface IServerError extends Error {
   syscall?: string
   code?: string
}

const startServer = (): void => {
   cronJobs()

   const { app } = new App()

   const server: Server = app.listen(PORT, () => {
      console.info(`⚡️[server]: Server is running on http://localhost:${PORT}`)
   })

   server.on('error', (error: IServerError) => {
      if (error.syscall !== 'listen') {
         throw error
      }

      switch (error.code) {
         case 'EACCES': {
            console.error(
               `Port ${PORT} requires elevated privileges. Please run with administrator rights.`,
            )
            process.exit(1)
            break
         }
         case 'EADDRINUSE': {
            console.error(
               `Port ${PORT} is already in use!\nTo find the process: netstat -aon | findstr :${PORT}\nTo kill the process: taskkill /PID <PID> /F`,
            )
            process.exit(1)
            break
         }
         default: {
            throw error
         }
      }
   })

   process.on('SIGTERM', () => {
      console.info('SIGTERM signal received: closing HTTP server')
      server.close(() => {
         console.info('HTTP server closed')
         process.exit(0)
      })
   })

   process.on('SIGINT', () => {
      console.info('SIGINT signal received: closing HTTP server')
      server.close(() => {
         console.info('HTTP server closed')
         process.exit(0)
      })
   })
}

startServer()
