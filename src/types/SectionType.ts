import BaseType from './BaseType'

export type SectionBase = {
  name: string
  description?: string
  storeId: string
  staff: string[]
}

export type SectionType = BaseType & SectionBase
