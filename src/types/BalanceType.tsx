import BaseType from './BaseType'
import PaymentType from './PaymentType'

export type BalanceBase = {
  storeId: string
  type: 'partial' | 'full'
  userId?: string
  fromDate: Date
  toDate: Date
  payments: PaymentType[]
  total: number
  totalCash: number
  totalCard: number
  totalTransfer: number
}
// & ({ type: 'partial'; userId: string } | { type: 'full' })

export type BalanceType = BalanceBase & BaseType
