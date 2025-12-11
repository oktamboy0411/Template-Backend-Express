import type {
   collectionConstants,
   endpointConstants,
   statusConstants,
} from '../constants'

export type CollectionConstantsType =
   (typeof collectionConstants)[keyof typeof collectionConstants]

export type StatusConstantsType =
   (typeof statusConstants)[keyof typeof statusConstants]

export type EndpointConstantsType =
   (typeof endpointConstants)[keyof typeof endpointConstants]
