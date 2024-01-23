import ItemType from './ItemType'

export type RentItem = {
  id: ItemType['id']
  amount: number
  priceTitle: string
  time: number // in seconds
}
