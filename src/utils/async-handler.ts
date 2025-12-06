import type { NextFunction, Response } from 'express'

import type { ICustomRequest } from '@/types'

type AsyncFunction = (
   req: ICustomRequest,
   res: Response,
   next: NextFunction,
) => Promise<any>

export const asyncHandler =
   (fn: AsyncFunction) =>
   async (req: ICustomRequest, res: Response, next: NextFunction) => {
      try {
         await fn(req, res, next)
      } catch (error) {
         next(error)
      }
   }

type NoAsyncFunction = (
   req: ICustomRequest,
   res: Response,
   next: NextFunction,
) => any

export const noAsyncHandler =
   (fn: NoAsyncFunction) =>
   (req: ICustomRequest, res: Response, next: NextFunction) => {
      try {
         fn(req, res, next)
      } catch (error) {
         next(error)
      }
   }
