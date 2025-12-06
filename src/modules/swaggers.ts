import { authSwagger } from './auth'
import { uploadSwagger } from './upload'
import { userSwagger } from './users'

export const swaggerEndpoints = [uploadSwagger, userSwagger, authSwagger]
