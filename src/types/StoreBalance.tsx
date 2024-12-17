import BaseType from './BaseType'
import { CommentType } from './CommentType'
import OrderType from './OrderType'
import PaymentType from './PaymentType'
import { TimePriceType } from './PriceType'

export type StoreBalanceBase = {
  fromDate: Date
  toDate: Date
  storeId: string
  items: BalanceItems[]
  payments: BalancePayment[]
  orders: StoreBalanceOrder[]
  solvedReports: CommentType[]
}

export type StoreBalanceOrder = {
  clientName: string
  orderId: string
  orderType: OrderType['type']
  orderStatus: OrderType['status']
  orderFolio: OrderType['folio']
  items: BalanceItems[]
  payments: BalancePayment[]
  assignedSection: OrderType['assignedSection']
  time: TimePriceType
  renewedAt?: Date
  deliveredAt?: Date
  canceledAt?: Date
}

export type BalancePayment = PaymentType

// Pick<
//   PaymentType,
//   | 'id'
//   | 'orderId'
//   | 'amount'
//   | 'method'
//   | 'verifiedAt'
//   | 'canceledAt'
//   | 'createdBy'
//   | 'type'
// >

export type BalanceItems = {
  itemId: string
  itemEco: string
  assignedSection?: string
  categoryName?: string
  priceId?: string
  orderId?: string
  orderFolio?: number
  categoryId?: string
  //status: ItemType['status']
}

export type StoreBalanceType = StoreBalanceBase & BaseType
