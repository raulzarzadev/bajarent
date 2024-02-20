import BaseType from './BaseType'
import PaymentType from './PaymentType'

export type BalanceBase = {
  fromDate: Date
  toDate: Date
  payments: PaymentType[]
  total: number
  totalCash: number
  totalCard: number
  totalTransfer: number
} & ({ type: 'partial'; userId: string } | { type: 'full' })

export type BalanceType = BalanceBase & BaseType
