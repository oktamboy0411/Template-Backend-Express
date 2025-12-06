import type { NextFunction, Request, Response } from 'express'
import { rateLimit } from 'express-rate-limit'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import os from 'os'

import { HttpException } from '@/utils/http.exception'

export const rateLimiter = (minute: number, max: number) => {
   const cpuCount = Math.max(1, os.cpus().length)
   const perProcessMax = Math.max(1, Math.round(max / cpuCount))

   return rateLimit({
      windowMs: minute * 60 * 1000,
      max: perProcessMax,
      handler: (req: Request, _res: Response, next: NextFunction) => {
         const message = `Too many requests (${perProcessMax}) from this IP: ${req.ip as string}, please try again in ${minute} minute${
            minute !== 1 ? 's' : ''
         }.`
         return next(
            new HttpException(
               StatusCodes.TOO_MANY_REQUESTS,
               ReasonPhrases.TOO_MANY_REQUESTS,
               message,
            ),
         )
      },
   })
}
