import type { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import type { HttpException } from '@/utils/http.exception'

const DEFAULT_STATUS_CODE = StatusCodes.INTERNAL_SERVER_ERROR
const DEFAULT_STATUS_MSG = ReasonPhrases.INTERNAL_SERVER_ERROR
const DEFAULT_ERROR_MSG = ReasonPhrases.INTERNAL_SERVER_ERROR

export const errorMiddleware = (
   error: HttpException,
   _req: Request,
   res: Response,
): void => {
   const statusCode = !isNaN(error.statusCode)
      ? error.statusCode
      : DEFAULT_STATUS_CODE
   const statusMsg =
      error.statusMsg !== '' ? error.statusMsg : DEFAULT_STATUS_MSG
   const message =
      error.msg !== ''
         ? error.msg
         : error.message !== ''
           ? error.message
           : DEFAULT_ERROR_MSG

   res.status(statusCode).json({
      success: false,
      error: {
         statusCode,
         statusMsg,
         message,
      },
   })
}
