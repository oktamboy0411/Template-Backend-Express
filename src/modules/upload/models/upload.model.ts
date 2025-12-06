import { Schema, model } from 'mongoose'

import { collectionConstants } from '@/constants'
import type { CollectionConstantsType } from '@/types'

export interface IUploadDocument {
   user: object
   filePath: string
   is_use: boolean
   where_used: CollectionConstantsType
   created_at: Date
}

const documentSchema = new Schema<IUploadDocument>(
   {
      user: { type: Object },
      filePath: { type: String, required: true },
      is_use: { type: Boolean, required: true, default: false },
      where_used: {
         type: String,
         enum: Object.values(collectionConstants),
      },
      created_at: { type: Date, default: Date.now },
   },
   { versionKey: false },
)

export const uploadModel = model<IUploadDocument>(
   collectionConstants.UPLOAD,
   documentSchema,
   collectionConstants.UPLOAD,
)
