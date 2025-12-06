import type { ISwagger, ISwaggerEndpoint } from '../../types'

const buildSwaggerPath = (endpoint: string, path: string): string => {
   return `/${endpoint}/${path}`
}

export const addSwaggerEndpoint = (
   swagger: ISwagger,
   endpoint: ISwaggerEndpoint,
): void => {
   endpoint.paths.forEach((pathItem) => {
      const fullPath = buildSwaggerPath(endpoint.endpoint, pathItem.path)
      swagger.paths[fullPath] = pathItem.body
   })
}
