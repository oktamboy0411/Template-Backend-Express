import type { NextFunction, Response } from 'express'
import { validationResult } from 'express-validator'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import type { ICustomRequest } from '@/types'
import { HttpException } from '@/utils'

export const validateMiddleware = (
   req: ICustomRequest,
   res: Response,
   next: NextFunction,
) => {
   const errors = validationResult(req)
   if (errors.isEmpty()) {
      return next()
   }
   let messages = ''

   errors.array().map((err: any) => {
      messages += `${err.msg as string} `
   })

   throw new HttpException(
      StatusCodes.UNPROCESSABLE_ENTITY,
      ReasonPhrases.UNPROCESSABLE_ENTITY,
      messages.trimEnd(),
   )
}
