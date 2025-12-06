import { SwaggerEndpoints } from '@/modules'

import { Swagger, addSwaggerEndpoint } from './main'

SwaggerEndpoints.forEach((SwaggerEndpoint) => {
   addSwaggerEndpoint(Swagger, SwaggerEndpoint)
})

export { Swagger }
