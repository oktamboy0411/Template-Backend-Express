import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { HttpException, JwtHelpers, asyncHandler } from '@/utils'

const BEARER_PREFIX = 'Bearer'
const TOKEN_PARTS = 2

const extractTokenFromHeader = (
   authorizationHeader?: string,
): string | null => {
   if (
      typeof authorizationHeader !== 'string' ||
      !authorizationHeader.startsWith(BEARER_PREFIX)
   ) {
      return null
   }

   const parts = authorizationHeader.split(' ')
   return parts.length === TOKEN_PARTS ? parts[1] : null
}

// eslint-disable-next-line require-await
export const verifyToken = asyncHandler(async (req, res, next) => {
   const token = extractTokenFromHeader(req.headers.authorization)

   if (token === null || token === '') {
      throw new HttpException(
         StatusCodes.UNAUTHORIZED,
         ReasonPhrases.UNAUTHORIZED,
         'Authentication token is required',
      )
   }

   const decoded = JwtHelpers.verify(token)

   if (decoded.id === '') {
      throw new HttpException(
         StatusCodes.UNAUTHORIZED,
         ReasonPhrases.UNAUTHORIZED,
         'Invalid token payload',
      )
   }

   req.userId = decoded.id

   next()
})
