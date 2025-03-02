import BaseType from './BaseType'
import { CommentType } from './CommentType'
import ItemType from './ItemType'
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
  type: 'custom' | 'daily' | 'monthly'
}

export type StoreBalanceOrder = {
  clientName: string
  orderId: string
  orderType: OrderType['type']
  orderStatus: OrderType['status']
  orderFolio: OrderType['folio']
  orderNote: OrderType['note']
  items: BalanceItems[]
  payments: BalancePayment[]
  assignedSection: OrderType['assignedSection']
  time: TimePriceType
  renewedAt: Date | null
  extendedAt: Date | null
  deliveredAt: Date | null
  canceledAt: Date | null
  repairingAt: Date | null
  paidAt: Date | null
  createdAt: Date | null
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
  retiredAt?: Date
  createdAt?: Date

  /**
   * @deprecated it should be removed, status of item can change any time.
   * ! status is creating an error in the StoreBalance because is shows in rows and that is not ok
   */
  status?: ItemType['status'] //* <---- Should not be added because can change any time
}

export type StoreBalanceType = StoreBalanceBase & BaseType
