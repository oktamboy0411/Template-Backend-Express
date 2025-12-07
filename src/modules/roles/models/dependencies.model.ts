import type { Types } from 'mongoose'
import { Schema, model } from 'mongoose'

import { collectionConstants } from '@/constants'

export interface IDependenciesDocument {
   _id?: Types.ObjectId
   module: string
   endpoint: string
   created_at?: Date
   updated_at?: Date
}

const dependenciesSchema = new Schema<IDependenciesDocument>(
   {
      module: { type: String, required: true },
      endpoint: { type: String, required: true },
   },
   {
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   },
)

export const dependenciesModel = model<IDependenciesDocument>(
   collectionConstants.DEPENDENCIES,
   dependenciesSchema,
   collectionConstants.DEPENDENCIES,
)
