const AuthSwagger = {
   endpoint: 'auth',
   paths: [
      {
         path: 'login',
         body: {
            post: {
               tags: ['Auth'],
               summary: 'User login',
               requestBody: {
                  required: true,
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              username: { type: 'string', example: 'user123' },
                              password: { type: 'string', example: 'password' },
                           },
                           required: ['username', 'password'],
                        },
                     },
                  },
               },
               responses: {
                  '200': {
                     description: 'Login successful',
                     content: {
                        'application/json': {
                           schema: {
                              type: 'object',
                              properties: {
                                 success: { type: 'boolean', example: true },
                                 access_token: {
                                    type: 'string',
                                    example: 'eyJhbGciOi...',
                                 },
                              },
                           },
                        },
                     },
                  },
                  '400': { description: 'Invalid username or password' },
               },
            },
         },
      },

      {
         path: 'sign-up/ceo',
         body: {
            post: {
               tags: ['Auth'],
               summary: 'CEO sign-up',
               requestBody: {
                  required: true,
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              username: { type: 'string', example: 'ceo123' },
                              password: { type: 'string', example: 'password' },
                              reg_key: {
                                 type: 'string',
                                 example: 'registrationkey789',
                              },
                           },
                           required: ['username', 'password', 'reg_key'],
                        },
                     },
                  },
               },
               responses: {
                  '201': {
                     description: 'CEO created successfully',
                     content: {
                        'application/json': {
                           schema: {
                              type: 'object',
                              properties: {
                                 success: { type: 'boolean', example: true },
                                 message: {
                                    type: 'string',
                                    example: 'CEO created successfully',
                                 },
                              },
                           },
                        },
                     },
                  },
                  '400': { description: 'Invalid input or registration key' },
               },
            },
         },
      },

      {
         path: 'me',
         body: {
            get: {
               tags: ['Auth'],
               summary: 'Get current user (requires auth)',
               responses: {
                  '200': {
                     description: 'Current user data',
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
                                    },
                                 },
                              },
                           },
                        },
                     },
                  },
                  '401': { description: 'Unauthorized' },
               },
            },
         },
      },

      {
         path: 'update-me',
         body: {
            patch: {
               tags: ['Auth'],
               summary: "Update current user's profile",
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
                              phone: {
                                 type: 'string',
                                 example: '+998901234567',
                              },
                              license_number: { type: 'string' },
                           },
                        },
                     },
                  },
               },
               responses: {
                  '200': { description: 'Profile updated successfully' },
                  '400': { description: 'Validation error or duplicate field' },
                  '401': { description: 'Unauthorized' },
               },
            },
         },
      },

      {
         path: 'update-password',
         body: {
            patch: {
               tags: ['Auth'],
               summary: "Update current user's password",
               requestBody: {
                  required: true,
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              old_password: {
                                 type: 'string',
                                 example: 'oldPass',
                              },
                              new_password: {
                                 type: 'string',
                                 example: 'newPass123',
                              },
                           },
                           required: ['old_password', 'new_password'],
                        },
                     },
                  },
               },
               responses: {
                  '200': { description: 'Password updated successfully' },
                  '400': {
                     description: 'Incorrect old password or validation error',
                  },
                  '401': { description: 'Unauthorized' },
               },
            },
         },
      },
   ],
}

export default AuthSwagger
