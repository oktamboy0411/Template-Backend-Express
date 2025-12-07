import type { Types } from 'mongoose'
import { Schema, model } from 'mongoose'

import { collectionConstants } from '@/constants'

export interface IPermissionDocument {
   _id?: Types.ObjectId
   module: string
   description: string
   endpoints: Types.ObjectId[]
   created_at?: Date
   updated_at?: Date
}

const rermissionSchema = new Schema<IPermissionDocument>(
   {
      module: { type: String, required: true },
      description: { type: String, required: true },
      endpoints: {
         type: [Schema.Types.ObjectId],
         ref: collectionConstants.ENDPOINT,
         required: true,
      },
   },
   {
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   },
)

export const permissionModel = model<IPermissionDocument>(
   collectionConstants.PERMISSION,
   rermissionSchema,
   collectionConstants.PERMISSION,
)
