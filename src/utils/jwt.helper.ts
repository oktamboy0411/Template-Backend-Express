import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import pkg from 'jsonwebtoken'

import { HttpException } from './http.exception'
import { JWT_SECRET, JWT_SECRET_REFRESH } from './secrets'

interface IJwtSignOptions {
   expiresIn?: string | number
   [key: string]: unknown
}

interface IJWT {
   verify: (token: string, secretKey: string) => { id: string }
   sign: (
      payload: object,
      secretOrPrivateKey: string,
      options?: IJwtSignOptions,
   ) => string
}

const { sign: jwtSign, verify: jwtVerify } = pkg as unknown as IJWT

export class JwtHelpers {
   public static sign(id: string, expiresIn: string): string {
      return jwtSign({ id }, JWT_SECRET, { expiresIn })
   }

   public static signRefresh(id: string, expiresIn: string): string {
      return jwtSign({ id }, JWT_SECRET_REFRESH, { expiresIn })
   }

   public static verify(token: string): { id: string } {
      try {
         return jwtVerify(token, JWT_SECRET)
      } catch (error) {
         const message =
            error instanceof Error ? error.message : 'Invalid token'
         throw new HttpException(
            StatusCodes.UNAUTHORIZED,
            ReasonPhrases.UNAUTHORIZED,
            message,
         )
      }
   }

   public static verifyRefresh(token: string): { id: string } {
      try {
         return jwtVerify(token, JWT_SECRET_REFRESH)
      } catch (error) {
         const message =
            error instanceof Error ? error.message : 'Invalid refresh token'
         throw new HttpException(
            StatusCodes.UNAUTHORIZED,
            ReasonPhrases.UNAUTHORIZED,
            message,
         )
      }
   }
}
