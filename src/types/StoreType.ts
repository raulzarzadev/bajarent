import BaseType from './BaseType'
import { order_type } from './OrderType'
import { SectionType } from './SectionType'
import StaffType from './StaffType'

export type BaseStoreType = {
  name: string
  description?: string
  staff?: StaffType[]
  currentFolio?: number
  sections?: SectionType[]
  orderTypes?: keyof order_type[]
}

type StoreType = BaseType & BaseStoreType

export default StoreType
