import { IconName } from '../components/Icon'
import BaseType from './BaseType'

export type SectionBase = {
  name: string
  description?: string
  storeId: string
  staff: string[]
  icon?: IconName
}

export type SectionType = BaseType & SectionBase
