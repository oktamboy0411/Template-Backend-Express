import type { Request } from 'express'

import type { IUserDocument } from '@/modules/users'

export interface ICustomRequest extends Request {
   user?: IUserDocument
}
