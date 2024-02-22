import BaseType from './BaseType'

export type TimeType = 'day' | 'month' | 'year' | 'week' | 'hour' | 'minute'
export type TimePriceType = `${number} ${TimeType}`

export type PriceBase = {
  title: string
  amount: number
  time?: TimePriceType

  categoryId: string
  storeId: string
}

export type PriceType = PriceBase & BaseType
