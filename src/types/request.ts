import type { Request } from 'express'

import type { UserDocumentI } from '@/modules/users'

export interface ICustomRequest extends Request {
   user?: UserDocumentI
}
