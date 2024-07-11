import PaymentType, { payment_methods } from '../types/PaymentType'

export const payments_amount = (payments: Partial<PaymentType>[]) => {
  return payments?.reduce(
    (acc, p) => {
      const amount = parseFloat(`${p?.amount || 0}`)
      if (p.canceled) {
        acc.canceled += amount
        return acc
      }
      if (!p.verified && p.method === payment_methods.TRANSFER) {
        acc.transfersNotVerified += amount
        acc.total += amount
        acc.transfers += amount
        return acc
      }
      acc.total += amount
      if (p.method === payment_methods.CASH) acc.cash += amount
      if (p.method === payment_methods.CARD) acc.card += amount
      if (p.method === payment_methods.TRANSFER) acc.transfers += amount

      return acc
    },
    {
      total: 0,
      cash: 0,
      card: 0,
      transfers: 0,
      canceled: 0,
      transfersNotVerified: 0
    }
  )
}

export type PaymentsAmount = ReturnType<typeof payments_amount>
