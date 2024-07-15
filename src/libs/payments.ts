import PaymentType, { payment_methods } from '../types/PaymentType'

export const payments_amount = (payments: Partial<PaymentType>[]) => {
  return payments?.reduce(
    (acc, p) => {
      const amount = parseFloat(`${p?.amount || 0}`)
      if (p.canceled) {
        acc.canceled += amount
        return acc
      }
      if (p.isRetirement) {
        acc.total -= amount
        acc.cash -= amount
        acc.retirements += amount
        acc.outcomes += amount

        return acc
      } else {
        //* if transfer is not verified count count as it
        if (!p.verified && p.method === payment_methods.TRANSFER) {
          acc.transfersNotVerified += amount
        }
        if (p.method === payment_methods.CASH) acc.cash += amount
        if (p.method === payment_methods.CARD) acc.card += amount
        if (p.method === payment_methods.TRANSFER) acc.transfers += amount
        acc.total += amount
        acc.incomes += amount
        return acc
      }
    },
    {
      total: 0,
      cash: 0,
      card: 0,
      transfers: 0,
      canceled: 0,
      transfersNotVerified: 0,
      retirements: 0,
      incomes: 0,
      outcomes: 0
    }
  )
}

export type PaymentsAmount = ReturnType<typeof payments_amount>
