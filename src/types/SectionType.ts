import type { IconName } from '../components/Icon'
import type BaseType from './BaseType'

export type SectionBase = {
	name: string
	description?: string
	storeId: string
	staff: string[]
	icon?: IconName
	type: StoreSectionType
	defaultArea?: boolean //*<-- this area will be created by default
}
export const store_section_types = {
	workshop: 'taller',
	storage: 'bodega',
	delivery: 'reparto'
}

export type StoreSectionType = keyof typeof store_section_types
export const store_section_icons: Record<StoreSectionType, IconName> = {
	workshop: 'tools',
	storage: 'warehouse',
	delivery: 'truck'
}

export type SectionType = BaseType & SectionBase
