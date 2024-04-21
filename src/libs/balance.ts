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

  ordersCreated = orders
    .filter((o) => {
      //* if values.type === partial only show orders created by that user
      if (values.type === 'partial') return o.createdBy === values.userId
      return true
    })
    //* returns only the id of the order
    .map(({ id }) => id)

  ordersPickup = orders
    .filter((o) => {
      //* if values.type === partial only show orders created by that user
      if (values.type === 'partial') return o.pickedUpBy === values.userId
      return true
    })
    //* returns only the id of the order
    .map(({ id }) => id)
  ordersDelivered = orders
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
