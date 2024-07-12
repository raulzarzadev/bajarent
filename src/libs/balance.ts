import { or, where } from 'firebase/firestore'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { BalanceOrders, BalanceType } from '../types/BalanceType'
import OrderType, { order_status, order_type } from '../types/OrderType'
import { payments_amount } from './payments'
import { ServiceComments } from '../firebase/ServiceComments'
import asDate from './utils-date'
import { ServicePayments } from '../firebase/ServicePayments'
import PaymentType from '../types/PaymentType'

export const balanceTotals = (balance: BalanceType) => {
  return payments_amount(balance.payments)
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
  //console.log({ balanceType: type })
  const reportsUnsolved = await ServiceComments.findMany(
    [
      where('storeId', '==', storeId),
      where('type', '==', 'report'),
      where('solved', '==', true),
      where('solvedAt', '>=', fromDate),
      where('solvedAt', '<=', toDate)
    ]
    // { justRefs: true }
  )
  const ordersIdsWithSolvedReports = Array.from(
    new Set(reportsUnsolved.map((r) => r.orderId))
  )
  console.log({ reportsUnsolved })

  const ordersWithSolvedReports = await ServiceOrders.getList(
    ordersIdsWithSolvedReports
  )

  const reportedOrdersSolvedBySection = ordersWithSolvedReports.filter(
    (o) => section === o.assignToSection
  )

  const inRentFilters = [
    where('status', '==', order_status.DELIVERED),
    where('storeId', '==', storeId),
    where('type', '==', order_type.RENT)
  ]

  const pickedUpFilters = [
    where('status', 'in', [order_status.PICKED_UP]),
    where('storeId', '==', storeId),
    where('pickedUpAt', '>=', fromDate),
    where('pickedUpAt', '<=', toDate)
  ]

  const deliveredFilters = [
    where('storeId', '==', storeId),
    where('deliveredAt', '>=', fromDate),
    where('deliveredAt', '<=', toDate)
  ]
  const canceledFilters = [
    where('storeId', '==', storeId),
    where('cancelledAt', '>=', fromDate),
    where('cancelledAt', '<=', toDate)
  ]

  if (type === 'partial') {
    inRentFilters.push(where('assignToSection', '==', section))
    pickedUpFilters.push(where('assignToSection', '==', section))
    deliveredFilters.push(where('assignToSection', '==', section))
    canceledFilters.push(where('assignToSection', '==', section))
  }

  const ordersInRent: Partial<OrderType>[] = await ServiceOrders.findMany(
    inRentFilters
    // { justRefs: true }
  )
  const ordersPickup = await ServiceOrders.findMany(pickedUpFilters, {
    justRefs: true
  })
  const ordersDelivered = await ServiceOrders.findMany(deliveredFilters, {
    justRefs: true
  })
  const ordersCancelled = await ServiceOrders.findMany(canceledFilters, {
    justRefs: true
  })

  const ordersRenewed = ordersInRent?.filter((o) => {
    const renews = Object.values(o.extensions || {}).filter(
      (e) => e.reason === 'renew'
    )
    // .sort((a, b) =>
    //   asDate(a.createdAt).getTime() > asDate(b.createdAt).getTime() ? -1 : 1
    // )
    const renewsInDate = renews.filter((r) => {
      return (
        asDate(r.createdAt).getTime() >= asDate(fromDate).getTime() &&
        asDate(r.createdAt).getTime() <= asDate(toDate).getTime()
      )
    })
    return renewsInDate.length > 0
  })

  return {
    ordersRenewed: ordersRenewed.map((o) => o.id),
    ordersPickup: ordersPickup.map((o) => o.id),
    ordersDelivered: ordersDelivered.map((o) => o.id),
    ordersInRent: ordersInRent.map((o) => o.id),
    ordersCancelled: ordersCancelled.map((o) => o.id),
    ordersReportedSolved: reportedOrdersSolvedBySection.map((o) => o.id),
    ordersCreated: []
  }
}

export const getBalancePayments = async ({
  section,
  fromDate,
  toDate,
  type,
  storeId
}) => {
  /* ******************************************** 
 //* Is necessary get the orders from the section to define section payments           
   *******************************************rz */

  // //* 1.- Filter payments by date from server
  try {
<<<<<<< HEAD
    const paymentsByDate: PaymentType[] =
=======
    const paymentsByDate =
>>>>>>> dev
      (await ServicePayments.findMany([
        where('storeId', '==', storeId),
        where('createdAt', '>=', fromDate),
        where('createdAt', '<=', toDate)
      ]).catch((e) => console.error({ e }))) || []
    //* 2.- Find orders from payments, remove duplicates , remove nullish
    const paymentOrders = Array.from(
      new Set(paymentsByDate.map((p) => p.orderId))
    ).filter((o) => !!o)

    const notOrderPayments = paymentsByDate.filter((p) => !p.orderId)

    let sectionOrders = []
    let sectionPayments = []

    if (type === 'partial') {
      notOrderPayments.forEach((p) => {
        if (p.sectionId === section) sectionPayments.push(p)
      })
      sectionOrders =
        (await ServiceOrders.getList(paymentOrders, {
          sections: [section]
        }).catch((e) => console.error({ e }))) || []
    }
    if (type === 'full') {
      sectionOrders =
        (await ServiceOrders.getList(paymentOrders).catch((e) =>
          console.error({ e })
        )) || []
      sectionPayments = notOrderPayments
    }
    //* 3.- Set orders with payments
    const ordersWithPayments = sectionOrders.map((o) => {
      const orderPayments = paymentsByDate?.filter((p) => p.orderId === o.id)
      return { ...o, payments: orderPayments }
    })

    //* 3.- Need paid orders and payments in dates
    const paidOrders = ordersWithPayments
    const ordersPayments = ordersWithPayments.map((o) => o.payments).flat()
    return { paidOrders, payments: [...ordersPayments, ...sectionPayments] }
  } catch (e) {
    console.error(e)
  }
}

export type SectionBalance = typeof calculateSectionBalance
