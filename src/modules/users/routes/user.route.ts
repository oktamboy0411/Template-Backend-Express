import { authMiddleware, roleMiddleware } from '@/utils'
import { validate } from '@/validators'

import { Router } from 'express'

import { UserController } from '../controllers/user.controller'
import { UserValidator } from '../validators/user.validator'

const userRouter = Router()

userRouter.post(
   '/create',
   authMiddleware,
   roleMiddleware(['ceo']),
   UserValidator.create(),
   validate,
   UserController.create,
)
userRouter.put(
   '/update/:id',
   authMiddleware,
   roleMiddleware(['ceo']),
   UserValidator.update(),
   validate,
   UserController.update,
)
userRouter.get(
   '/get-all',
   authMiddleware,
   roleMiddleware(['ceo']),
   UserValidator.getAll(),
   validate,
   UserController.getAll,
)
userRouter.delete(
   '/delete/:id',
   authMiddleware,
   roleMiddleware(['ceo']),
   UserValidator.mongoId(),
   validate,
   UserController.delete,
)
userRouter.get(
   '/get-one/:id',
   authMiddleware,
   roleMiddleware(['ceo']),
   UserValidator.mongoId(),
   validate,
   UserController.getById,
)

export { userRouter }
