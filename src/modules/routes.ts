import { authRouter } from './auth'
import { uploadRouter } from './upload'
import { userRouter } from './users'

export const Routes = [
   { path: '/upload', router: uploadRouter },
   { path: '/auth', router: authRouter },
   { path: '/user', router: userRouter },
]
