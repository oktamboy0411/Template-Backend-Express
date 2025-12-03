import { UserModel } from '@/modules/users'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { asyncHandler } from './async-handler'
import { HttpException } from './http.exception'
import { JwtHelpers } from './jwt.helper'

export const authMiddleware = asyncHandler(async (req, res, next) => {
   let token

   if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
   }

   if (!token) {
      throw new HttpException(
         StatusCodes.UNAUTHORIZED,
         ReasonPhrases.UNAUTHORIZED,
         ReasonPhrases.UNAUTHORIZED,
      )
   }

   const decoded = JwtHelpers.verify(token) as { id: string; role: string }

   if (decoded && !decoded.id) {
      throw new HttpException(
         StatusCodes.UNAUTHORIZED,
         ReasonPhrases.UNAUTHORIZED,
         ReasonPhrases.UNAUTHORIZED,
      )
   }

   const user = await UserModel.findById(decoded.id)

   if (!user) {
      throw new HttpException(
         StatusCodes.NOT_FOUND,
         ReasonPhrases.NOT_FOUND,
         'User not found!',
      )
   }

   req.user = user

   next()
})
