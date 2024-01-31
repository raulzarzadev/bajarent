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
  // id: ItemType['id']
  // amount: number
  // priceTitle: string
  // time: number // in seconds
  categoryName: string
  priceSelectedId: string
  priceSelected: PriceType
}

export type Category = { name: string; id: string; prices?: PriceType[] }
