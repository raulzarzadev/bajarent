import { where } from 'firebase/firestore'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { BalanceOrders, BalanceType } from '../types/BalanceType'
import OrderType, { order_status } from '../types/OrderType'
import { payment_methods } from '../types/PaymentType'
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

export const balanceOrders = async ({
  values
}: //orders
{
  values: BalanceType
  //orders: OrderType[]
}): Promise<BalanceOrders> => {
  //* YOU CANT FILTER ORDERS BY USER OR DATE BECAUSE YOU ARE VALIDATING DIFFERENT THINGS

  let ordersCreated = []
  let ordersPickup = []
  let ordersDelivered = []
  let ordersRenewed = []

  /* ******************************************** 
             FILTER BY DATE               
   *******************************************rz */

  //*1 get orders creates from date
  const createdOrders = await ServiceOrders.findMany([
    where('createdAt', '>=', values.fromDate),
    where('createdAt', '<=', values.toDate)
  ])

  const pickedUpOrders = await ServiceOrders.findMany([
    where('pickedUpAt', '>=', values.fromDate),
    where('pickedUpAt', '<=', values.toDate),
    where('status', '==', order_status.PICKED_UP)
  ])

  const deliveredOrders = await ServiceOrders.findMany([
    where('deliveredAt', '>=', values.fromDate),
    where('deliveredAt', '<=', values.toDate),
    where('status', '==', order_status.DELIVERED)
  ])

  const renewedOrders = await ServiceOrders.findMany([
    where('renewedAt', '>=', values.fromDate),
    where('renewedAt', '<=', values.toDate),
    where('status', '==', order_status.RENEWED)
  ])

  console.log({ createdOrders, pickedUpOrders, deliveredOrders, renewedOrders })

  ordersCreated = [...createdOrders]

  ordersPickup = [...pickedUpOrders]

  ordersDelivered = [...deliveredOrders]

  ordersRenewed = [...renewedOrders]

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

  ordersRenewed = [...ordersRenewed]
    .filter((o) => {
      //* if values.type === partial only show orders created by that user
      if (values.type === 'partial') return o.renewedBy === values.userId
      return true
    })
    //* returns only the id of the order
    .map(({ id }) => id)
  return {
    ordersCreated,
    ordersPickup,
    ordersDelivered,
    ordersRenewed
  }
}
