interface ISwaggerContact {
   name: string
   email: string
}

interface ISwaggerInfo {
   title: string
   description: string
   version: string
   contact: ISwaggerContact
}

interface ISwaggerServer {
   url: string
   description: string
}

interface ISwaggerSecurityScheme {
   type: string
   scheme: string
   bearerFormat: string
}

interface ISwaggerComponents {
   schemas: Record<string, unknown>
   securitySchemes: {
      bearerAuth: ISwaggerSecurityScheme
   }
}

interface ISwaggerSecurity {
   bearerAuth: string[]
}

export interface ISwagger {
   openapi: string
   info: ISwaggerInfo
   servers: ISwaggerServer[]
   components: ISwaggerComponents
   security: ISwaggerSecurity[]
   paths: Record<string, unknown>
}

export interface ISwaggerEndpoint {
   endpoint: string
   paths: Array<{
      path: string
      body: unknown
   }>
}
