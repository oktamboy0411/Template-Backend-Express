import type { NextFunction, Request, Response } from 'express'
import type { RateLimitRequestHandler } from 'express-rate-limit'
import { rateLimit } from 'express-rate-limit'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import os from 'node:os'

import { HttpException } from '@/utils/http.exception'

const SECONDS_PER_MINUTE = 60
const MILLISECONDS_PER_SECOND = 1000
const MILLISECONDS_PER_MINUTE = SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND
const MIN_CPU_COUNT = 1
const MIN_RATE_LIMIT = 1
const UNKNOWN_IP = 'unknown'

const calculatePerProcessLimit = (maxRequests: number): number => {
   const cpuCount = Math.max(MIN_CPU_COUNT, os.cpus().length)
   return Math.max(MIN_RATE_LIMIT, Math.round(maxRequests / cpuCount))
}

const buildRateLimitMessage = (
   maxRequests: number,
   minutes: number,
   ipAddress: string,
): string => {
   const minuteText = minutes !== 1 ? 'minutes' : 'minute'
   return `Too many requests (${maxRequests}) from IP ${ipAddress}. Please try again in ${minutes} ${minuteText}.`
}

export const rateLimiter = (
   minutes: number,
   maxRequests: number,
): RateLimitRequestHandler => {
   const perProcessMax = calculatePerProcessLimit(maxRequests)

   return rateLimit({
      windowMs: minutes * MILLISECONDS_PER_MINUTE,
      max: perProcessMax,
      handler: (req: Request, _res: Response, next: NextFunction) => {
         const ipAddress = req.ip ?? UNKNOWN_IP
         const message = buildRateLimitMessage(
            perProcessMax,
            minutes,
            ipAddress,
         )

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
