import { FormOrderFields } from '../components/FormOrder'
import BaseType from './BaseType'
import { TypeOrderKey, order_type } from './OrderType'
import { SectionType } from './SectionType'
import StaffType from './StaffType'

export type BaseStoreType = {
  name: string
  description?: string
  staff?: StaffType[]
  currentFolio?: number
  sections?: SectionType[]
  allowSections?: boolean
  allowStaff?: boolean
  img?: string
  marketVisible?: boolean
  orderTypes?: Record<TypeOrderKey, boolean>
  orderFields?: Record<TypeOrderKey, FormOrderFields[]>
  bankInfo?: {
    bank: string
    clabe: string
  }[]
}

type StoreType = BaseType & BaseStoreType

export default StoreType
