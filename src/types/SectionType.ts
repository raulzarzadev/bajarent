import { IconName } from '../components/Icon'
import BaseType from './BaseType'

export type SectionBase = {
  name: string
  description?: string
  storeId: string
  staff: string[]
  icon?: IconName
  defaultArea?: boolean //*<-- this area will be created by default
}

export type SectionType = BaseType & SectionBase
