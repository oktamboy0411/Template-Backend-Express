import type { ISwagger, ISwaggerEndpoint } from '../../types'

export const addSwaggerEndpoint = (
   swagger: ISwagger,
   endpoint: ISwaggerEndpoint,
): void => {
   endpoint.paths.forEach((path) => {
      swagger.paths[`/${endpoint.endpoint}/${path.path}`] = path.body
   })
}
