import type { SwaggerEndpointType, SwaggerType } from '../../types'

export function addSwaggerEndpoint(
   swagger: SwaggerType,
   endpoint: SwaggerEndpointType,
) {
   endpoint.paths.forEach((path) => {
      swagger.paths[`/${endpoint.endpoint}/${path.path}`] = path.body
   })
}
