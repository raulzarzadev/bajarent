import { BalanceOrders, BalanceType } from '../types/BalanceType'
import OrderType from '../types/OrderType'
import PaymentType, { payment_methods } from '../types/PaymentType'
import asDate from './utils-date'

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

export const balanceOrders = ({
  values,
  orders
}: {
  values: BalanceType
  orders: OrderType[]
}): BalanceOrders => {
  //* YOU CANT FILTER ORDERS BY USER OR DATE BECAUSE YOU ARE VALIDATING DIFFERENT THINGS

  let ordersCreated = []
  let ordersPickup = []
  let ordersDelivered = []

  /* ******************************************** 
             FILTER BY DATE               
   *******************************************rz */
  ordersCreated = [...orders].filter((o) => {
    const createdAt = asDate(o?.createdAt)
    return (
      asDate(createdAt)?.getTime() >= asDate(values?.fromDate)?.getTime() &&
      asDate(createdAt)?.getTime() <= asDate(values?.toDate)?.getTime()
    )
  })

  ordersPickup = [...orders].filter((o) => {
    const pickedUpAt = asDate(o?.pickedUpAt)
    return (
      asDate(pickedUpAt)?.getTime() >= asDate(values?.fromDate)?.getTime() &&
      asDate(pickedUpAt)?.getTime() <= asDate(values?.toDate)?.getTime()
    )
  })

  ordersDelivered = [...orders].filter((o) => {
    const deliveredAt = asDate(o?.deliveredAt)
    return (
      asDate(deliveredAt)?.getTime() >= asDate(values?.fromDate)?.getTime() &&
      asDate(deliveredAt)?.getTime() <= asDate(values?.toDate)?.getTime()
    )
  })

  /* ******************************************** 
             FILTER BY USER               
   *******************************************rz */

  ordersCreated = [...ordersCreated]
    .filter((o) => {
      //* if values.type === partial only show orders created by that user
      if (values.type === 'partial') return o.createdBy === values.userId
      return true
    })
    //* returns only the id of the order
    .map(({ id }) => id)

  ordersPickup = [...ordersPickup]
    .filter((o) => {
      //* if values.type === partial only show orders created by that user
      if (values.type === 'partial') return o.pickedUpBy === values.userId
      return true
    })
    //* returns only the id of the order
    .map(({ id }) => id)
  ordersDelivered = [...ordersDelivered]
    .filter((o) => {
      //* if values.type === partial only show orders created by that user
      if (values.type === 'partial') return o.deliveredBy === values.userId
      return true
    })
    //* returns only the id of the order
    .map(({ id }) => id)

  return {
    ordersCreated,
    ordersPickup,
    ordersDelivered
  }
}
