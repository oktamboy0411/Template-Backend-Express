import type { CollectionConstantsType, EndpointConstantsType } from './contants'

interface IPermissionsItem {
   name: EndpointConstantsType
   dependencies: CollectionConstantsType[]
}

export interface IPermissionsType {
   collection_name: CollectionConstantsType
   endpoints: IPermissionsItem[]
}
