import BaseType from './BaseType'
import ItemType from './ItemType'
import { PriceType } from './PriceType'

export type RentItem = {
  categoryName: string
  priceSelectedId: string
  priceSelected: PriceType
}

export type CategoryBase = {
  name: string
  description: string
  prices: Partial<PriceType>[]
  storeId: string
}

export type CategoryType = CategoryBase & BaseType
export type Category = CategoryType

export type RentItemType = ItemType & RentItem & BaseType
