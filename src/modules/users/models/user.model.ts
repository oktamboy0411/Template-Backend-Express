import { Schema, model } from 'mongoose'

import {
   collectionConstants,
   roleConstants,
   sectionConstants,
   statusConstants,
} from '@/constants'
import type {
   RoleConstantsType,
   SectionConstantsType,
   StatusConstantsType,
} from '@/types'

export interface IUserDocument {
   _id: string
   lastname: string
   firstname: string
   phone: string
   role: RoleConstantsType
   section?: SectionConstantsType
   password: string
   status?: StatusConstantsType
}

const documentSchema = new Schema<IUserDocument>(
   {
      fullname: { type: String },
      username: { type: String, required: true, unique: true },
      phone: { type: String },
      role: {
         type: String,
         enum: Object.values(roleConstants),
         required: true,
      },
      section: {
         type: String,
         enum: Object.values(sectionConstants),
      },
      password: { type: String, required: true, select: false },
      status: {
         type: String,
         enum: Object.values(statusConstants),
      },
   },
   {
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   },
)

export const userModel = model<IUserDocument>(
   collectionConstants.USER,
   documentSchema,
   collectionConstants.USER,
)
