import type { ISwagger } from '../../types'
import { PORT } from '../../utils'

export const swagger: ISwagger = {
   openapi: '3.1.0',
   info: {
      title: 'API Documentation',
      description: 'This is the API documentation for the backend service.',
      version: '1.0.0',
      contact: {
         name: 'Support Team',
         email: 'support@example.com',
      },
   },
   servers: [
      {
         url: `http://localhost:${PORT || 3000}`,
         description: 'Development server',
      },
      {
         url: 'https://jayron-med.onrender.com',
         description: 'Production server',
      },
   ],
   components: {
      schemas: {},
      securitySchemes: {
         bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
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
