const UploadSwagger = {
   endpoint: 'upload',
   paths: [
      {
         path: 'file',
         body: {
            post: {
               tags: ['Upload'],
               summary: 'Upload a single file',
               requestBody: {
                  required: true,
                  content: {
                     'multipart/form-data': {
                        schema: {
                           type: 'object',
                           properties: {
                              file: {
                                 type: 'string',
                                 format: 'binary',
                              },
                           },
                           required: ['file'],
                        },
                     },
                  },
               },
               responses: {
                  '200': {
                     description: 'File uploaded successfully',
                     content: {
                        'application/json': {
                           schema: {
                              type: 'object',
                              properties: {
                                 success: { type: 'boolean', example: true },
                                 url: {
                                    type: 'string',
                                    example: '/uploads/abc.jpg',
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
         path: 'files',
         body: {
            post: {
               tags: ['Upload'],
               summary: 'Upload multiple files',
               requestBody: {
                  required: true,
                  content: {
                     'multipart/form-data': {
                        schema: {
                           type: 'object',
                           properties: {
                              files: {
                                 type: 'array',
                                 items: { type: 'string', format: 'binary' },
                              },
                           },
                           required: ['files'],
                        },
                     },
                  },
               },
               responses: {
                  '200': {
                     description: 'Files uploaded successfully',
                     content: {
                        'application/json': {
                           schema: {
                              type: 'object',
                              properties: {
                                 success: { type: 'boolean', example: true },
                                 urls: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: [
                                       '/uploads/a.jpg',
                                       '/uploads/b.jpg',
                                    ],
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
   ],
}

export default UploadSwagger
