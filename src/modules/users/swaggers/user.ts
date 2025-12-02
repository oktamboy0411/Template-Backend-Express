const UserSwagger = {
   endpoint: 'user',
   paths: [
      {
         path: 'create',
         body: {
            post: {
               tags: ['User'],
               summary: 'Create a new user',
               requestBody: {
                  required: true,
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              username: { type: 'string', example: 'johndoe' },
                              password: { type: 'string', example: 'P@ssw0rd' },
                              fullname: { type: 'string', example: 'John Doe' },
                              email: {
                                 type: 'string',
                                 format: 'email',
                                 example: 'john@example.com',
                              },
                              phone: {
                                 type: 'string',
                                 example: '+998901234567',
                              },
                              role: { type: 'string', example: 'ADMIN' },
                              section: { type: 'string', example: 'terapiya' },
                              permissions: {
                                 type: 'array',
                                 items: { type: 'string' },
                              },
                              license_number: {
                                 type: 'string',
                                 example: 'LN-1234',
                              },
                           },
                           required: [
                              'username',
                              'password',
                              'fullname',
                              'email',
                              'phone',
                           ],
                        },
                     },
                  },
               },
               responses: {
                  '201': {
                     description: 'User created successfully',
                     content: {
                        'application/json': {
                           schema: {
                              type: 'object',
                              properties: {
                                 success: { type: 'boolean', example: true },
                                 message: {
                                    type: 'string',
                                    example: 'User created successfully',
                                 },
                              },
                           },
                        },
                     },
                  },
                  '400': { description: 'Validation error or duplicate field' },
               },
            },
         },
      },
      {
         path: 'get-all',
         body: {
            get: {
               tags: ['User'],
               summary: 'Get paginated list of users',
               parameters: [
                  {
                     name: 'page',
                     in: 'query',
                     schema: { type: 'integer', example: 1 },
                  },
                  {
                     name: 'limit',
                     in: 'query',
                     schema: { type: 'integer', example: 10 },
                  },
                  {
                     name: 'search',
                     in: 'query',
                     schema: { type: 'string', example: 'john' },
                  },
                  {
                     name: 'role',
                     in: 'query',
                     schema: { type: 'string', example: 'ADMIN' },
                  },
               ],
               responses: {
                  '200': {
                     description: 'List of users',
                     content: {
                        'application/json': {
                           schema: {
                              type: 'object',
                              properties: {
                                 success: { type: 'boolean', example: true },
                                 data: {
                                    type: 'array',
                                    items: {
                                       type: 'object',
                                       properties: {
                                          _id: { type: 'string' },
                                          username: { type: 'string' },
                                          fullname: { type: 'string' },
                                          email: { type: 'string' },
                                          phone: { type: 'string' },
                                          role: { type: 'string' },
                                          status: { type: 'string' },
                                          created_at: {
                                             type: 'string',
                                             format: 'date-time',
                                          },
                                       },
                                    },
                                 },
                                 pagination: {
                                    type: 'object',
                                    properties: {
                                       page: { type: 'integer' },
                                       limit: { type: 'integer' },
                                       total_items: { type: 'integer' },
                                       total_pages: { type: 'integer' },
                                       next_page: { type: ['integer', 'null'] },
                                       prev_page: { type: ['integer', 'null'] },
                                    },
                                 },
                              },
                           },
                        },
                     },
                  },
               },
            },
         },
      },
      {
         path: 'get-one/:id',
         body: {
            get: {
               tags: ['User'],
               summary: 'Get a single user by id',
               parameters: [
                  {
                     name: 'id',
                     in: 'path',
                     required: true,
                     schema: {
                        type: 'string',
                        example: '64b8f1a2c3d4e5f6a7b8c9d0',
                     },
                  },
               ],
               responses: {
                  '200': {
                     description: 'User object',
                     content: {
                        'application/json': {
                           schema: {
                              type: 'object',
                              properties: {
                                 success: { type: 'boolean', example: true },
                                 data: {
                                    type: 'object',
                                    properties: {
                                       _id: { type: 'string' },
                                       username: { type: 'string' },
                                       fullname: { type: 'string' },
                                       email: { type: 'string' },
                                       phone: { type: 'string' },
                                       role: { type: 'string' },
                                       section: { type: 'string' },
                                       permissions: {
                                          type: 'array',
                                          items: { type: 'string' },
                                       },
                                       status: { type: 'string' },
                                       created_at: {
                                          type: 'string',
                                          format: 'date-time',
                                       },
                                       license_number: { type: 'string' },
                                    },
                                 },
                              },
                           },
                        },
                     },
                  },
                  '404': { description: 'User not found' },
               },
            },
         },
      },
      {
         path: 'update/:id',
         body: {
            put: {
               tags: ['User'],
               summary: 'Update a user',
               parameters: [
                  {
                     name: 'id',
                     in: 'path',
                     required: true,
                     schema: {
                        type: 'string',
                        example: '64b8f1a2c3d4e5f6a7b8c9d0',
                     },
                  },
               ],
               requestBody: {
                  required: true,
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              fullname: { type: 'string' },
                              username: { type: 'string' },
                              email: { type: 'string', format: 'email' },
                              phone: { type: 'string' },
                              role: { type: 'string' },
                              section: { type: 'string' },
                              license_number: { type: 'string' },
                              password: { type: 'string' },
                              permissions: {
                                 type: 'array',
                                 items: { type: 'string' },
                              },
                           },
                        },
                     },
                  },
               },
               responses: {
                  '200': { description: 'User updated successfully' },
                  '400': { description: 'Validation error or duplicate field' },
                  '404': { description: 'User not found' },
               },
            },
         },
      },
      {
         path: 'delete/:id',
         body: {
            delete: {
               tags: ['User'],
               summary: 'Delete a user by id',
               parameters: [
                  {
                     name: 'id',
                     in: 'path',
                     required: true,
                     schema: {
                        type: 'string',
                        example: '64b8f1a2c3d4e5f6a7b8c9d0',
                     },
                  },
               ],
               responses: {
                  '200': { description: 'User deleted successfully' },
                  '404': { description: 'User not found' },
               },
            },
         },
      },
   ],
}

export default UserSwagger 
