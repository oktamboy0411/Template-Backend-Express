import type { NextFunction, Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import type { HttpException } from '@/utils/http.exception'

export const errorMiddleware = (
   error: HttpException,
   req: Request,
   res: Response,
   next: NextFunction,
): any => {
   const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
   const statusMsg = error.statusMsg || ReasonPhrases.INTERNAL_SERVER_ERROR
   const msg = error.msg || error.message || ReasonPhrases.GATEWAY_TIMEOUT

   return res.status(statusCode).json({
      success: false,
      error: {
         statusCode,
         statusMsg,
         msg,
      },
   })
}
