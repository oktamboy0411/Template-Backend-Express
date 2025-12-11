import type { NextFunction, RequestHandler, Response } from 'express'

import type {
   CollectionConstantsType,
   EndpointConstantsType,
   ICustomRequest,
} from '@/types'
import { noAsyncHandler } from '@/utils'

import { permissions } from '../../constants'

export const permissionMiddleware = (
   collection: CollectionConstantsType,
   endpoint: EndpointConstantsType,
   dependencies: CollectionConstantsType[],
): RequestHandler =>
   noAsyncHandler((req: ICustomRequest, _res: Response, next: NextFunction) => {
      permissions.push({
         collection_name: collection,
         endpoints: [
            {
               name: endpoint,
               dependencies,
            },
         ],
      })

      next()
   })
