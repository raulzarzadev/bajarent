import BaseType from './BaseType'
import ItemType from './ItemType'

export type TimePriceType = `${number} ${
  | 'day'
  | 'month'
  | 'year'
  | 'week'
  | 'hour'
  | 'minute'}`

export type PriceType = {
  title: string
  amount: number
  id: string
  time: TimePriceType
}
export type RentItem = {
  categoryName: string
  priceSelectedId: string
  priceSelected: PriceType
}

export type Category = { name: string; id: string; prices?: PriceType[] }

export type CategoryBase = {
  name: string
  description: string
}

export type CategoryType = CategoryBase & BaseType

export type RentItemType = ItemType & RentItem & BaseType
