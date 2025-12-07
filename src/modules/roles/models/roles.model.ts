import type { Types } from 'mongoose'
import { Schema, model } from 'mongoose'

import { collectionConstants } from '@/constants'

export interface IRoleDocument {
   _id?: Types.ObjectId
   name: string
   description: string | null
   permissions: Types.ObjectId[]
   created_at?: Date
   updated_at?: Date
}

const documentSchema = new Schema<IRoleDocument>(
   {
      name: { type: String, required: true, unique: true },
      description: { type: String, default: null },
      permissions: {
         type: [Schema.Types.ObjectId],
         ref: collectionConstants.PERMISSION,
         required: true,
      },
   },
   {
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   },
)

export const roleModel = model<IRoleDocument>(
   collectionConstants.ROLE,
   documentSchema,
   collectionConstants.ROLE,
)
