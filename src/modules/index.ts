import { AuthSwagger, authRouter } from './auth'
import { UploadSwagger, uploadRouter } from './upload'
import { UserSwagger, userRouter } from './users'

export const SwaggerEndpoints = [UploadSwagger, UserSwagger, AuthSwagger]

export const Routes = [
   { path: '/upload', router: uploadRouter },
   { path: '/auth', router: authRouter },
   { path: '/user', router: userRouter },
]
