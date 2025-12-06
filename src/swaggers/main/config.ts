import type { ISwagger } from '../../types'
import { PORT } from '../../utils'

const OPENAPI_VERSION = '3.1.0'
const API_TITLE = 'API Documentation'
const API_DESCRIPTION = 'This is the API documentation for the backend service.'
const API_VERSION = '1.0.0'
const SUPPORT_TEAM = 'Support Team'
const SUPPORT_EMAIL = 'support@example.com'
const SERVER_DESCRIPTION = 'Development server'
const AUTH_TYPE = 'http'
const AUTH_SCHEME = 'bearer'
const AUTH_FORMAT = 'JWT'

export const swagger: ISwagger = {
   openapi: OPENAPI_VERSION,
   info: {
      title: API_TITLE,
      description: API_DESCRIPTION,
      version: API_VERSION,
      contact: {
         name: SUPPORT_TEAM,
         email: SUPPORT_EMAIL,
      },
   },
   servers: [
      {
         url: `http://localhost:${PORT}`,
         description: SERVER_DESCRIPTION,
      },
   ],
   components: {
      schemas: {},
      securitySchemes: {
         bearerAuth: {
            type: AUTH_TYPE,
            scheme: AUTH_SCHEME,
            bearerFormat: AUTH_FORMAT,
         },
      },
   },
   security: [
      {
         bearerAuth: [],
      },
   ],
   paths: {},
}
