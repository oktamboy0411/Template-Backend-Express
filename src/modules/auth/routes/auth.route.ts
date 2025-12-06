import { Router } from 'express'

import { authMiddleware, validateMiddleware } from '@/middlewares'

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

authRouter.get('/me', authMiddleware, AuthController.getMe)

authRouter.patch(
   '/update-me',
   authMiddleware,
   AuthValidator.updateMe(),
   validateMiddleware,
   AuthController.updateMe,
)

authRouter.patch(
   '/update-password',
   authMiddleware,
   AuthValidator.updatePassword(),
   validateMiddleware,
   AuthController.updatePassword,
)

export { authRouter }
