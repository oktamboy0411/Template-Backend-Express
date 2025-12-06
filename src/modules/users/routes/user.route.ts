import { Router } from 'express'

import {
   checkUser,
   roleMiddleware,
   validateMiddleware,
   verifyToken,
} from '@/middlewares'

import { UserController } from '../controllers/user.controller'
import { UserValidator } from '../validators/user.validator'

const userRouter = Router()

userRouter.post(
   '/create',
   verifyToken,
   checkUser,
   roleMiddleware(['ceo']),
   UserValidator.create(),
   validateMiddleware,
   UserController.create,
)
userRouter.put(
   '/update/:id',
   verifyToken,
   checkUser,
   roleMiddleware(['ceo']),
   UserValidator.update(),
   validateMiddleware,
   UserController.update,
)
userRouter.get(
   '/get-all',
   verifyToken,
   checkUser,
   roleMiddleware(['ceo']),
   UserValidator.getAll(),
   validateMiddleware,
   UserController.getAll,
)
userRouter.delete(
   '/delete/:id',
   verifyToken,
   checkUser,
   roleMiddleware(['ceo']),
   UserValidator.mongoId(),
   validateMiddleware,
   UserController.delete,
)
userRouter.get(
   '/get-one/:id',
   verifyToken,
   checkUser,
   roleMiddleware(['ceo']),
   UserValidator.mongoId(),
   validateMiddleware,
   UserController.getById,
)

export { userRouter }
