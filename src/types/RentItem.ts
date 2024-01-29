import { PriceType } from '../components/FormSelectItem'

export type RentItem = {
  // id: ItemType['id']
  // amount: number
  // priceTitle: string
  // time: number // in seconds
  categoryName: string
  priceSelectedId: string
  priceSelected: PriceType
}
