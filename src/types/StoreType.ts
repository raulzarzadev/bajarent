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
  allowSections?: boolean
  allowStaff?: boolean
  img?: string
  marketVisible?: boolean
}

type StoreType = BaseType & BaseStoreType

export default StoreType
