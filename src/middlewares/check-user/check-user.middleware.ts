import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { userModel } from '@/modules'
import { HttpException, asyncHandler } from '@/utils'

export const checkUser = asyncHandler(async (req, res, next) => {
   if (req.userId === undefined || req.userId === '') {
      throw new HttpException(
         StatusCodes.UNAUTHORIZED,
         ReasonPhrases.UNAUTHORIZED,
         'User ID not found in request',
      )
   }

   const user = await userModel.findById(req.userId)

   if (user === null) {
      throw new HttpException(
         StatusCodes.NOT_FOUND,
         ReasonPhrases.NOT_FOUND,
         'User not found',
      )
   }

   req.user = user

   next()
})
