import BaseType from './BaseType'
import StaffType from './StaffType'

export type BaseStoreType = {
  name: string
  description?: string
  staff?: StaffType[]
}

type StoreType = BaseType & BaseStoreType

export default StoreType
