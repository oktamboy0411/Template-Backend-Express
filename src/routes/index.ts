import { authRouter, uploadRouter, userRouter } from '@/modules'

export const Routes = [
   { path: '/upload', router: uploadRouter },
   { path: '/auth', router: authRouter },
   { path: '/user', router: userRouter },
]
