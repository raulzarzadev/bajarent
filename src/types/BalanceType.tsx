import BaseType from './BaseType'
import PaymentType from './PaymentType'

export type BalanceOrders = {
  ordersCreated?: string[]
  ordersPickup?: string[]
  ordersDelivered?: string[]
  ordersRenewed?: string[]
  ordersCancelled?: string[]
  ordersInRent?: string[]
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

// & ({ type: 'partial'; userId: string } | { type: 'full' })

export type BalanceType = BalanceBase & BaseType
