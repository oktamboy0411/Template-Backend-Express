import { Router } from 'express'

import { checkUser, validateMiddleware, verifyToken } from '@/middlewares'

import { AuthController } from '../controllers/auth.controller'
import { AuthValidator } from '../validators/auth.validator'

const authRouter = Router()

authRouter.post(
   '/login',
   AuthValidator.login(),
   validateMiddleware,
   AuthController.login,
)

authRouter.post(
   '/sign-up/ceo',
   AuthValidator.signUpCeo(),
   validateMiddleware,
   AuthController.signUpCeo,
)

authRouter.get('/me', verifyToken, checkUser, AuthController.getMe)

authRouter.patch(
   '/update-me',
   verifyToken,
   checkUser,
   AuthValidator.updateMe(),
   validateMiddleware,
   AuthController.updateMe,
)

authRouter.patch(
   '/update-password',
   verifyToken,
   checkUser,
   AuthValidator.updatePassword(),
   validateMiddleware,
   AuthController.updatePassword,
)

export { authRouter }
