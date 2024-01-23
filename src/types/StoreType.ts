import BaseType from './BaseType'

export type BaseStoreType = {
  name: string
}

type StoreType = BaseType & BaseStoreType

export default StoreType
