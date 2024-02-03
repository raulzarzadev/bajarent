import BaseType from './BaseType'
import { SectionType } from './SectionType'
import StaffType from './StaffType'

export type BaseStoreType = {
  name: string
  description?: string
  staff?: StaffType[]
  currentFolio?: number
  sections?: SectionType[]
}

type StoreType = BaseType & BaseStoreType

export default StoreType
