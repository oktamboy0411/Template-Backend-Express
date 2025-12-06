import { swaggerEndpoints } from '@/modules'

import { addSwaggerEndpoint, swagger } from './main'

const initializeSwagger = (): void => {
   swaggerEndpoints.forEach((endpoint) => {
      addSwaggerEndpoint(swagger, endpoint)
   })
}

initializeSwagger()

export { swagger }
