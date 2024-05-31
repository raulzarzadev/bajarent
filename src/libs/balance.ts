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

export const calculateSectionBalance = async ({
  section,
  fromDate,
  toDate,
  storeId,
  type
}: {
  storeId: string
} & Pick<BalanceType, 'section' | 'fromDate' | 'toDate' | 'type'>) => {
  console.log({ balanceType: type })
  if (type === 'partial') {
    const ordersInRent = await ServiceOrders.findMany(
      [
        where('status', '==', order_status.DELIVERED),
        where('storeId', '==', storeId),
        where('assignToSection', '==', section)
      ],
      { justRefs: true }
    )

    const oldRenewed = await ServiceOrders.findMany(
      [
        where('status', '==', order_status.RENEWED),
        where('storeId', '==', storeId),
        where('assignToSection', '==', section),
        where('renewedAt', '>=', fromDate),
        where('renewedAt', '<=', toDate)
      ],
      { justRefs: true }
    )
    const ordersRenewed = oldRenewed.map((o) => o.renewedTo)

    const ordersPickup = await ServiceOrders.findMany(
      [
        where('status', 'in', [order_status.PICKED_UP]),
        where('storeId', '==', storeId),
        where('assignToSection', '==', section),
        where('pickedUpAt', '>=', fromDate),
        where('pickedUpAt', '<=', toDate)
      ],
      { justRefs: true }
    )
    const ordersDelivered = await ServiceOrders.findMany(
      [
        where('assignToSection', '==', section),
        where('deliveredAt', '>=', fromDate),
        where('deliveredAt', '<=', toDate)
      ],
      { justRefs: true }
    )
    const ordersCancelled = await ServiceOrders.findMany([
      where('assignToSection', '==', section),
      where('cancelledAt', '>=', fromDate),
      where('cancelledAt', '<=', toDate)
    ])

    return {
      ordersRenewed,
      ordersPickup: ordersPickup.map((o) => o.id),
      ordersDelivered: ordersDelivered.map((o) => o.id),
      ordersInRent: ordersInRent.map((o) => o.id),
      ordersCancelled: ordersCancelled.map((o) => o.id),
      ordersCreated: []
    }
  } else if (type === 'full') {
    const ordersInRent = await ServiceOrders.findMany(
      [
        where('status', '==', order_status.DELIVERED),
        where('storeId', '==', storeId)
      ],
      { justRefs: true }
    )

    const oldRenewed = await ServiceOrders.findMany(
      [
        where('status', 'in', [order_status.RENEWED]),
        where('storeId', '==', storeId),
        where('renewedAt', '>=', fromDate),
        where('renewedAt', '<=', toDate)
      ]
      // { justRefs: true } //*<- its necesary to get the renewedTo data
    )
    const ordersRenewed = oldRenewed.map((o) => o.renewedTo)

    const ordersPickup = await ServiceOrders.findMany(
      [
        where('status', 'in', [order_status.PICKED_UP]),
        where('storeId', '==', storeId),
        where('pickedUpAt', '>=', fromDate),
        where('pickedUpAt', '<=', toDate)
      ],
      { justRefs: true }
    )
    const ordersDelivered = await ServiceOrders.findMany(
      [
        where('storeId', '==', storeId),
        where('deliveredAt', '>=', fromDate),
        where('deliveredAt', '<=', toDate)
      ],
      { justRefs: true }
    )
    const ordersCancelled = await ServiceOrders.findMany(
      [
        where('storeId', '==', storeId),
        where('cancelledAt', '>=', fromDate),
        where('cancelledAt', '<=', toDate)
      ],
      { justRefs: true }
    )

    return {
      ordersRenewed,
      ordersPickup: ordersPickup.map((o) => o.id),
      ordersDelivered: ordersDelivered.map((o) => o.id),
      ordersInRent: ordersInRent.map((o) => o.id),
      ordersCancelled: ordersCancelled.map((o) => o.id),
      ordersCreated: []
    }
  }
}

export type SectionBalance = typeof calculateSectionBalance
