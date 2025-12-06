import {
   collectionConstants,
   permissionConstants,
   roleConstants,
   sectionConstants,
} from '../constants'
import { statusConstants } from '../constants/status'

const _collectionConstantsEnum = Object.values(collectionConstants)
export type CollectionConstantsType = (typeof _collectionConstantsEnum)[number]

const _roleConstantsEnum = Object.values(roleConstants)
export type RoleConstantsType = (typeof _roleConstantsEnum)[number]

const _sectionConstantsEnum = Object.values(sectionConstants)
export type SectionConstantsType = (typeof _sectionConstantsEnum)[number]

const _permissionEnum = Object.values(permissionConstants)
export type PermissionConstantsType = (typeof _permissionEnum)[number]

const _statusConstantsEnum = Object.values(statusConstants)
export type StatusConstantsType = (typeof _statusConstantsEnum)[number]
