import { UserDocumentI } from '@/modules/users'

import { NextFunction, Request, Response } from 'express'

export interface CustomRequest extends Request {
   user?: UserDocumentI
}

type AsyncFunction = (
   req: CustomRequest,
   res: Response,
   next: NextFunction,
) => Promise<any>

export const asyncHandler =
   (fn: AsyncFunction) =>
   async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
         await fn(req, res, next)
      } catch (error) {
         next(error)
      }
   }

type NoAsyncFunction = (
   req: CustomRequest,
   res: Response,
   next: NextFunction,
) => any

export const noAsyncHandler =
   (fn: NoAsyncFunction) =>
   (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
         fn(req, res, next)
      } catch (error) {
         next(error)
      }
   }
