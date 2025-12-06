import type { NextFunction, RequestHandler, Response } from 'express'
import type { ValidationError } from 'express-validator'
import { validationResult } from 'express-validator'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import type { ICustomRequest } from '@/types'
import { HttpException } from '@/utils'

const ERROR_SEPARATOR = ' '

const extractErrorMessages = (errors: ValidationError[]): string => {
   return errors
      .map((err) => err.msg)
      .join(ERROR_SEPARATOR)
      .trimEnd()
}

export const validateMiddleware: RequestHandler = (
   req: ICustomRequest,
   _res: Response,
   next: NextFunction,
): void => {
   const errors = validationResult(req)

   if (errors.isEmpty()) {
      next()
      return
   }

   const errorMessages = extractErrorMessages(errors.array())

   throw new HttpException(
      StatusCodes.UNPROCESSABLE_ENTITY,
      ReasonPhrases.UNPROCESSABLE_ENTITY,
      errorMessages,
   )
}
