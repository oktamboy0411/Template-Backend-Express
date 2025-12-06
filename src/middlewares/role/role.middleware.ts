import type { NextFunction, RequestHandler, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import type { ICustomRequest, RoleConstantsType } from '@/types'
import { HttpException, noAsyncHandler } from '@/utils'

const FORBIDDEN_MESSAGE = 'Access denied. Insufficient permissions.'
const ROLE_MISSING_MESSAGE = 'User role not found.'

const validateUserRole = (role: RoleConstantsType | undefined): void => {
   if (role === undefined) {
      throw new HttpException(
         StatusCodes.FORBIDDEN,
         ReasonPhrases.FORBIDDEN,
         ROLE_MISSING_MESSAGE,
      )
   }
}

const validateRolePermission = (
   userRole: RoleConstantsType,
   allowedRoles: RoleConstantsType[],
): void => {
   if (!allowedRoles.includes(userRole)) {
      throw new HttpException(
         StatusCodes.FORBIDDEN,
         ReasonPhrases.FORBIDDEN,
         FORBIDDEN_MESSAGE,
      )
   }
}

export const roleMiddleware = (
   allowedRoles: RoleConstantsType[],
): RequestHandler =>
   noAsyncHandler((req: ICustomRequest, _res: Response, next: NextFunction) => {
      const userRole = req.user?.role

      validateUserRole(userRole)

      if (userRole !== undefined) {
         validateRolePermission(userRole, allowedRoles)
      }

      next()
   })
