import type { NextFunction, Response } from 'express'

import type { ICustomRequest } from '@/types'

type AsyncRequestHandler = (
   req: ICustomRequest,
   res: Response,
   next: NextFunction,
) => Promise<void>

type SyncRequestHandler = (
   req: ICustomRequest,
   res: Response,
   next: NextFunction,
) => void

/**
 * Wraps an async Express route handler to catch errors and pass them to the error middleware
 * @param fn - Async function to wrap
 * @returns Express middleware function
 */
export const asyncHandler = (
   fn: AsyncRequestHandler,
): ((req: ICustomRequest, res: Response, next: NextFunction) => void) => {
   return (req: ICustomRequest, res: Response, next: NextFunction): void => {
      Promise.resolve(fn(req, res, next)).catch(next)
   }
}

/**
 * Wraps a synchronous Express route handler to catch errors and pass them to the error middleware
 * @param fn - Synchronous function to wrap
 * @returns Express middleware function
 */
export const noAsyncHandler = (
   fn: SyncRequestHandler,
): ((req: ICustomRequest, res: Response, next: NextFunction) => void) => {
   return (req: ICustomRequest, res: Response, next: NextFunction): void => {
      try {
         fn(req, res, next)
      } catch (error) {
         next(error)
      }
   }
}
