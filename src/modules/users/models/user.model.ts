import { Schema, model } from 'mongoose'

import {
   CollectionConstants,
   PermissionConstants,
   RoleConstants,
   SectionConstants,
   StatusConstants,
} from '../../../constants'
import {
   PermissionConstantsType,
   RoleConstantsType,
   SectionConstantsType,
   StatusConstantsType,
} from '../../../types'

export interface UserDocumentI {
   _id: string
   fullname: string
   username: string
   email: string
   phone: string
   role: RoleConstantsType
   section: SectionConstantsType
   license_number: string
   password: string
   permissions: PermissionConstantsType[]
   status: StatusConstantsType
}

const documentSchema = new Schema<UserDocumentI>(
   {
      fullname: { type: String },
      username: { type: String, required: true, unique: true },
      email: { type: String },
      phone: { type: String },
      role: {
         type: String,
         enum: Object.values(RoleConstants),
         required: true,
      },
      section: {
         type: String,
         enum: Object.values(SectionConstants),
      },
      license_number: { type: String },
      password: { type: String, required: true, select: false },
      permissions: {
         type: [String],
         enum: Object.values(PermissionConstants),
      },
      status: {
         type: String,
         enum: Object.values(StatusConstants),
      },
   },
   {
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   },
)

export const UserModel = model<UserDocumentI>(
   CollectionConstants.USER,
   documentSchema,
   CollectionConstants.USER,
)
