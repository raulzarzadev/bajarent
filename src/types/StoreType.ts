import BaseType from './BaseType'
import StaffType from './StaffType'

export type BaseStoreType = {
  name: string
  description?: string
  staff?: StaffType[]
  currentFolio?: number
}

type StoreType = BaseType & BaseStoreType

export default StoreType
