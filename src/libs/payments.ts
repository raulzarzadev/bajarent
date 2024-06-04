import PaymentType, { payment_methods } from '../types/PaymentType'

export const payments_amount = (payments: PaymentType[]) => {
  return payments?.reduce(
    (acc, p) => {
      if (p.canceled) {
        acc.canceled += p.amount
        return acc
      }
      const amount = p?.amount || 0
      acc.total += amount
      if (p.method === payment_methods.CASH) acc.cash += amount
      if (p.method === payment_methods.CARD) acc.card += amount
      if (p.method === payment_methods.TRANSFER) acc.transfers += amount

      return acc
    },
    { total: 0, cash: 0, card: 0, transfers: 0, canceled: 0 }
  )
}

export type PaymentsAmount = ReturnType<typeof payments_amount>