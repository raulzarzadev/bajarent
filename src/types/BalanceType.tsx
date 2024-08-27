import BaseType from './BaseType'
import { OrderExtensionType } from './OrderType'
import PaymentType from './PaymentType'

export type BalanceOrders = {
  ordersCreated?: string[]
  ordersPickup?: string[]
  ordersDelivered?: string[]
  ordersRenewed?: string[]
  ordersCancelled?: string[]
  ordersInRent?: string[]
  paidOrders?: string[]
  ordersReportedSolved?: string[]
  assignedOrdersDelivered?: string[]
}
export type BalanceBase = {
  storeId: string
  type: 'partial' | 'full'
  userId?: string
  sections?: string[]
  section?: string
  fromDate: Date
  toDate: Date
  payments: PaymentType[]
  total: number
  totalCash: number
  totalCard: number
  totalTransfer: number
} & BalanceOrders

export type Balance_V2 = {
  sections: BalanceRowType[]
  storeId: string
  orderExtensions?: OrderExtensionType[]
  createdItems?: string[]
  retiredItems?: string[]
  createdOrders?: string[]
  cancelledOrders?: string[]
}
export type BalanceRowType = {
  section?: string
  pending?: string[]
  delivered?: string[]
  renewed?: string[]
  reports?: string[]
  cancelled?: string[]
  pickedUp?: string[]
  rented?: string[]
  inStock?: string[]
  cancelledToday?: string[]
  deliveredToday?: string[]
  pickedUpToday?: string[]
  inRent?: string[]
  renewedToday?: string[]
  reported?: string[]
  solvedToday?: string[]
  paidToday?: string[]
  payments?: PaymentType[]
}

export type BalanceRowKeyType = keyof BalanceRowType

export type BalanceType2 = Balance_V2 & BaseType
// & ({ type: 'partial'; userId: string } | { type: 'full' })

export type BalanceType = BalanceBase & BaseType
