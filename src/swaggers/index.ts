import { swaggerEndpoints } from '@/modules'

import { addSwaggerEndpoint, swagger } from './main'

swaggerEndpoints.forEach((swaggerEndpoint) => {
   addSwaggerEndpoint(swagger, swaggerEndpoint)
})

export { swagger }
