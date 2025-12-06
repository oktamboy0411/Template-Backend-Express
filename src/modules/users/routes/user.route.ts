import { Router } from 'express'

import { validateMiddleware } from '@/middlewares'
import { authMiddleware, roleMiddleware } from '@/utils'

import { UserController } from '../controllers/user.controller'
import { UserValidator } from '../validators/user.validator'

const userRouter = Router()

userRouter.post(
   '/create',
   authMiddleware,
   roleMiddleware(['ceo']),
   UserValidator.create(),
   validateMiddleware,
   UserController.create,
)
userRouter.put(
   '/update/:id',
   authMiddleware,
   roleMiddleware(['ceo']),
   UserValidator.update(),
   validateMiddleware,
   UserController.update,
)
userRouter.get(
   '/get-all',
   authMiddleware,
   roleMiddleware(['ceo']),
   UserValidator.getAll(),
   validateMiddleware,
   UserController.getAll,
)
userRouter.delete(
   '/delete/:id',
   authMiddleware,
   roleMiddleware(['ceo']),
   UserValidator.mongoId(),
   validateMiddleware,
   UserController.delete,
)
userRouter.get(
   '/get-one/:id',
   authMiddleware,
   roleMiddleware(['ceo']),
   UserValidator.mongoId(),
   validateMiddleware,
   UserController.getById,
)

export { userRouter }
