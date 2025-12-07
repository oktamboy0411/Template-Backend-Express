import type { Types } from 'mongoose'
import { Schema, model } from 'mongoose'

import { collectionConstants } from '@/constants'

export interface IEndpointDocument {
   _id?: Types.ObjectId
   name: string
   description: string
   is_allowed: boolean
   dependencies: Types.ObjectId[]
   created_at?: Date
   updated_at?: Date
}

const endpointSchema = new Schema<IEndpointDocument>(
   {
      name: { type: String, required: true },
      description: { type: String, required: true },
      is_allowed: { type: Boolean, default: false },
      dependencies: {
         type: [Schema.Types.ObjectId],
         ref: collectionConstants.DEPENDENCIES,
         required: true,
      },
   },
   {
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   },
)

export const endpointModel = model<IEndpointDocument>(
   collectionConstants.ENDPOINT,
   endpointSchema,
   collectionConstants.ENDPOINT,
)
