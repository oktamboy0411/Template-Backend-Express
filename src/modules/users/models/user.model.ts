import { Schema, model } from 'mongoose'

import {
   collectionConstants,
   permissionConstants,
   roleConstants,
   sectionConstants,
   statusConstants,
} from '@/constants'
import type {
   PermissionConstantsType,
   RoleConstantsType,
   SectionConstantsType,
   StatusConstantsType,
} from '@/types'

export interface IUserDocument {
   _id: string
   fullname: string
   username: string
   email: string
   phone: string
   role: RoleConstantsType
   section: SectionConstantsType
   licenseNumber: string
   password: string
   permissions: PermissionConstantsType[]
   status: StatusConstantsType
}

const documentSchema = new Schema<IUserDocument>(
   {
      fullname: { type: String },
      username: { type: String, required: true, unique: true },
      email: { type: String },
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
      licenseNumber: { type: String },
      password: { type: String, required: true, select: false },
      permissions: {
         type: [String],
         enum: Object.values(permissionConstants),
      },
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
