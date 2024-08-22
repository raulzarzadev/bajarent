import { FormOrderFields } from '../components/FormOrder'
import BaseType from './BaseType'
import ItemType from './ItemType'
import { TypeOrderKey, order_type } from './OrderType'
import { SectionType } from './SectionType'
import StaffType from './StaffType'
export type StoreItems = {
  [key: string]: Partial<ItemType>
}

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
  phone?: string
  mobile?: string
  address?: string

  schedule?: string
  currentItemNumber?: string
  // coords?: {
  //   lat: number
  //   lon: number
  // }
  location?: string
  orderTypes?: Record<TypeOrderKey, boolean>
  orderFields?: Record<TypeOrderKey, FormOrderFields>

  bankInfo?: {
    bank: string
    clabe: string
  }[]
  accountHolder?: string
  items?: StoreItems
}

type StoreType = BaseType & BaseStoreType

export default StoreType
