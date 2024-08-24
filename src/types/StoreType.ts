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

  /**
   * @deprecated use bankAccounts instead
   */
  bankInfo?: {
    bank: string
    clabe: string
  }[]
  /**
   * @deprecated use bankAccounts instead
   */
  phone?: string
  /**
   * @deprecated use bankAccounts instead
   */
  mobile?: string

  //* multi items

  bankAccounts?: MultiFields[]
  contacts?: MultiFields[]
  socialMedia?: MultiFields[]

  accountHolder?: string
  items?: StoreItems
}

export type MultiFields = {
  type: string
  label: string
  value: string
}

type StoreType = BaseType & BaseStoreType

export default StoreType
