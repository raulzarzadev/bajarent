import type { ItemSelected } from '../components/FormSelectItem'
import type BaseType from './BaseType'
import type ItemType from './ItemType'
import type { PriceType } from './PriceType'

export type RentItem = ItemSelected & {}

export type CategoryBase = {
	name: string
	description: string
	prices: Partial<PriceType>[]
	storeId: string
	img?: string
	marketVisible?: boolean
	marketForm?: {
		price?: boolean
		fullName?: boolean
		phone?: boolean
		neighborhood?: boolean
		address?: boolean
		references?: boolean
		imageId?: boolean
		scheduledAt?: boolean
		chooseBrand?: boolean
	}
	orderType?: {
		repair?: boolean
		rent?: boolean
		sale?: boolean
	}
}

export type CategoryType = CategoryBase & BaseType
export type Category = CategoryType

export type RentItemType = ItemType & RentItem & BaseType
