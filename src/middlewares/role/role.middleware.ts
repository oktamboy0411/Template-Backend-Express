import type { NextFunction, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import type { ICustomRequest, RoleConstantsType } from '@/types'
import { HttpException, noAsyncHandler } from '@/utils'

export const roleMiddleware = (allowedRoles: RoleConstantsType[]) =>
   noAsyncHandler((req: ICustomRequest, res: Response, next: NextFunction) => {
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
