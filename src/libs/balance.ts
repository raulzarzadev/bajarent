import { BalanceType } from '../types/BalanceType'
import { payment_methods } from '../types/PaymentType'

export const balanceTotal = (balance: BalanceType) =>
  balance?.payments?.reduce((acc, p) => acc + p.amount, 0)

export const balanceTotalCash = (balance: BalanceType) =>
  balance?.payments?.reduce(
    (acc, p) => acc + (p.method === payment_methods.CASH ? p.amount : 0),
    0
  )

export const balanceTotalCard = (balance: BalanceType) =>
  balance?.payments?.reduce(
    (acc, p) => acc + (p.method === payment_methods.CARD ? p.amount : 0),
    0
  )

export const balanceTotalTransfers = (balance: BalanceType) =>
  balance?.payments?.reduce(
    (acc, p) => acc + (p.method === payment_methods.TRANSFER ? p.amount : 0),
    0
  )

export const balanceTotals = (balance: BalanceType) => {
  return {
    total: balanceTotal(balance),
    cash: balanceTotalCash(balance),
    card: balanceTotalCard(balance),
    transfers: balanceTotalTransfers(balance)
  }
}
