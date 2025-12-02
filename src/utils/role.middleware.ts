import { RoleConstantsType } from '@/types'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { NextFunction, Response } from 'express'

import { CustomRequest, noAsyncHandler } from './async-handler'
import { HttpException } from './http.exception'

export const roleMiddleware = (allowedRoles: RoleConstantsType[]) =>
   noAsyncHandler((req: CustomRequest, res: Response, next: NextFunction) => {
      const role = req?.user?.role
      if (!role) {
         throw new HttpException(
            StatusCodes.FORBIDDEN,
            ReasonPhrases.FORBIDDEN,
            'You are not allowed!',
         )
      }
      if (!allowedRoles.includes(role)) {
         throw new HttpException(
            StatusCodes.FORBIDDEN,
            ReasonPhrases.FORBIDDEN,
            'You are not allowed!',
         )
      }
      next()
   })
