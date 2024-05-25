import { where } from 'firebase/firestore'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { BalanceOrders, BalanceType } from '../types/BalanceType'
import { order_status } from '../types/OrderType'
import { payment_methods } from '../types/PaymentType'

export const balanceTotals = (balance: BalanceType) => {
  return balance?.payments?.reduce(
    (acc, p) => {
      const amount = p?.amount || 0
      acc.total += amount
      if (p.method === payment_methods.CASH) acc.cash += amount
      if (p.method === payment_methods.CARD) acc.card += amount
      if (p.method === payment_methods.TRANSFER) acc.transfers += amount
      return acc
    },
    { total: 0, cash: 0, card: 0, transfers: 0 }
  )
}

export const balanceOrders = async ({
  values,
  storeId
}: //orders
{
  values: BalanceType
  storeId: string
  //orders: OrderType[]
}): Promise<BalanceOrders> => {
  //* YOU CANT FILTER ORDERS BY USER OR DATE BECAUSE YOU ARE VALIDATING DIFFERENT THINGS
  console.log({ values })
  let ordersCreated = []
  let ordersPickup = []
  let ordersDelivered = []
  let ordersRenewed = []
  let ordersCancelled = []

  /* ******************************************** 
             FILTER BY DATE               
   *******************************************rz */

  //*1 get orders creates from date
  const createdOrders = []
  //* avoid this call
  // await ServiceOrders.findMany([
  //   where('createdAt', '>=', values.fromDate),
  //   where('createdAt', '<=', values.toDate)
  // ])

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

  const cancelledOrders = await ServiceOrders.findMany([
    where('cancelledAt', '>=', values.fromDate),
    where('cancelledAt', '<=', values.toDate),
    where('status', '==', order_status.CANCELLED)
  ])

  let assignedOrdersDelivered = []
  if (values.sections?.length > 0) {
    assignedOrdersDelivered = await ServiceOrders.findMany([
      where('assignToSection', 'in', values.sections),
      where('status', 'in', [order_status.DELIVERED])
    ])
  } else if (values.type === 'full') {
    assignedOrdersDelivered = await ServiceOrders.findMany([
      where('status', 'in', [order_status.DELIVERED]),
      where('storeId', '==', storeId)
    ])
  }

  console.log({ assignedOrdersDelivered })

  /* ******************************************** 
             FILTER BY USER               
   *******************************************rz */

  const filterOrdersByUser = (
    orders: any[],
    values: BalanceType,
    field: string
  ) => {
    return (
      orders
        .filter((o) => {
          //* if values.type === partial only show orders created by that user
          if (values.type === 'partial') return o[field] === values.userId
          return true
        })
        //* returns only the id of the order
        .map(({ id }) => id)
    )
  }

  ordersCreated = filterOrdersByUser(createdOrders, values, 'createdBy')
  ordersPickup = filterOrdersByUser(pickedUpOrders, values, 'pickedUpBy')
  ordersDelivered = filterOrdersByUser(deliveredOrders, values, 'deliveredBy')
  ordersRenewed = filterOrdersByUser(renewedOrders, values, 'renewedBy')
  ordersCancelled = filterOrdersByUser(cancelledOrders, values, 'cancelledBy')

  return {
    ordersCreated,
    ordersPickup,
    ordersDelivered,
    ordersRenewed,
    ordersCancelled,
    assignedOrdersDelivered: assignedOrdersDelivered.map((o) => o.id)
  }
}
