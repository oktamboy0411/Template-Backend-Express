import { AuthSwagger, UploadSwagger, UserSwagger } from '@/modules'

import { Swagger, addSwaggerEndpoint } from './main'

addSwaggerEndpoint(Swagger, UploadSwagger)
addSwaggerEndpoint(Swagger, AuthSwagger)
addSwaggerEndpoint(Swagger, UserSwagger)

export { Swagger }
