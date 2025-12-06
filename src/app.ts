import cors from 'cors'
import type { Application, Request, Response, Router } from 'express'
import express from 'express'
import helmet from 'helmet'
import contentSecurityPolicy from 'helmet-csp'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import path from 'path'
import swaggerUi from 'swagger-ui-express'

import { errorMiddleware } from '@/middlewares'
import { routes } from '@/modules'

import { swagger } from './swaggers'
import { CONNECT_DB, HttpException, IP, noAsyncHandler } from './utils'

export class App {
   public app: Application

   public constructor() {
      this.app = express()

      void CONNECT_DB()

      this.initializeConfig()
      this.initializeDocumentation()
      this.initializeControllers()
      this.initializeErrorHandling()
   }

   private initializeConfig(): void {
      this.app.set('trust proxy', `loopback, ${IP}`)
      this.app.use(express.json())
      this.app.use(express.urlencoded({ extended: true }))
      this.app.use(helmet())
      this.app.use(
         contentSecurityPolicy({ useDefaults: true, reportOnly: false }),
      )
      this.app.use(
         cors({
            origin: '*',
            credentials: true,
         }),
      )

      const publicDir = path.join(__dirname, 'public')
      this.app.use('/public', express.static(publicDir))
   }

   private initializeDocumentation(): void {
      this.app.use(
         '/api-docs/',
         swaggerUi.serveFiles(swagger),
         swaggerUi.setup(swagger, {
            swaggerOptions: { persistAuthorization: true },
            customJs: '/public/swagger-custom.js',
         }),
      )
   }

   private initializeControllers(): void {
      this.app.get(
         '/',
         noAsyncHandler((req: Request, res: Response) =>
            res.status(StatusCodes.OK).json({
               success: true,
               msg: ReasonPhrases.OK,
            }),
         ),
      )
      routes.forEach((controller: { path: string; router: Router }) => {
         this.app.use(controller.path, controller.router)
      })
      this.app.all(/.*/, (req, res, next) => {
         next(
            new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               'Endpoint not found!',
            ),
         )
      })
   }

   private initializeErrorHandling(): void {
      this.app.use(errorMiddleware)
   }
}
