import { Schema, model } from 'mongoose'

import { collectionConstants } from '@/constants'
import type { CollectionConstantsType } from '@/types'

export interface IUploadDocument {
   user: object
   filePath: string
   isUse: boolean
   whereUsed: CollectionConstantsType
   createdAt: Date
}

const documentSchema = new Schema<IUploadDocument>(
   {
      user: { type: Object },
      filePath: { type: String, required: true },
      isUse: { type: Boolean, required: true, default: false },
      whereUsed: {
         type: String,
         enum: Object.values(collectionConstants),
      },
      createdAt: { type: Date, default: Date.now },
   },
   { versionKey: false },
)

export const uploadModel = model<IUploadDocument>(
   collectionConstants.UPLOAD,
   documentSchema,
   collectionConstants.UPLOAD,
)
