import { limit, orderBy, where } from 'firebase/firestore'
import { FirebaseGenericService } from './genericService'
import { BalanceType2 } from '../types/BalanceType'
import { ServiceOrders } from './ServiceOrders'
import OrderType, { order_status, order_type } from '../types/OrderType'
import asDate, { endDate, startDate } from '../libs/utils-date'
import { format, isAfter, isBefore, isToday } from 'date-fns'
import { getTodayRenews, isRenewedToday } from '../libs/orders'
import { ServiceComments } from './ServiceComments'
import { CommentType } from '../types/CommentType'
import { getBalancePayments } from '../libs/balance'
import PaymentType from '../types/PaymentType'
import { ServiceStoreItems } from './ServiceStoreItems'
import ItemType from '../types/ItemType'
import { StoreBalanceOrder, StoreBalanceType } from '../types/StoreBalance'
import { ServicePayments } from './ServicePayments'

class ServiceBalancesClass extends FirebaseGenericService<StoreBalanceType> {
  constructor() {
    super('balancesV3')
  }

  async getLast(storeId: string) {
    return this.getItems([
      where('storeId', '==', storeId),
      orderBy('createdAt', 'desc'),
      limit(1)
    ])
  }

  async getByStore(storeId: string) {
    return this.getItems([where('storeId', '==', storeId)])
  }

  async getLastInDate(storeId: string, date: Date) {
    return this.getItems([
      where('storeId', '==', storeId),
      where('createdAt', '<=', endDate(date)),
      where('createdAt', '>=', startDate(date)),
      orderBy('createdAt', 'desc'),
      limit(1)
    ])
  }

  async listenLastInDate(
    storeId: string,
    date: Date,
    cb: (data: Partial<BalanceType2>[]) => void
  ) {
    return this.listenMany(
      [
        where('storeId', '==', storeId),
        where('createdAt', '<=', endDate(date)),
        where('createdAt', '>=', startDate(date)),
        orderBy('createdAt', 'desc'),
        limit(1)
      ],
      (res) => cb(res?.[0] || {})
    )
  }

  async getOrders({ type, storeId, fromDate, toDate }: GetBalanceOrders) {
    if (type === 'rents-active') {
      return ServiceOrders.findMany([
        where('storeId', '==', storeId),
        where('type', '==', order_type.RENT),
        where('status', '==', order_status.DELIVERED)
      ])
    }
    if (type === 'rents-finished-date') {
      return ServiceOrders.findMany([
        where('storeId', '==', storeId),
        where('type', '==', order_type.RENT),
        where('status', '==', order_status.PICKED_UP),
        where('pickedUpAt', '>=', startDate(fromDate)),
        where('pickedUpAt', '<=', endDate(toDate))
      ])
    }
    if (type === 'repair-active') {
      return ServiceOrders.findMany([
        where('storeId', '==', storeId),
        where('type', '==', order_type.REPAIR),
        where('status', 'in', [
          order_status.PICKED_UP,
          order_status.REPAIRING,
          order_status.REPAIRED
        ])
      ])
    }
    if (type === 'repair-finished-date') {
      return ServiceOrders.findMany([
        where('storeId', '==', storeId),
        where('type', '==', order_type.REPAIR),
        where('status', '==', order_status.REPAIRED),
        where('pickedUpAt', '>=', startDate(fromDate)),
        where('pickedUpAt', '<=', endDate(toDate))
      ])
    }
    if (type === 'sales-date') {
      return ServiceOrders.findMany([
        where('storeId', '==', storeId),
        where('type', '==', order_type.SALE),
        where('status', '==', order_status.DELIVERED),
        where('deliveredAt', '>=', startDate(fromDate)),
        where('deliveredAt', '<=', endDate(toDate))
      ])
    }
  }
  async getFormattedOrders(
    props: GetBalanceOrders & { payments: PaymentType[] }
  ) {
    const orders = await this.getOrders(props)
    return orders.map((order) =>
      formatAsBalanceOrder({
        order,
        payments: props?.payments?.filter((p) => p.orderId === order.id)
      })
    )
  }

  async getBalanceOrders({ storeId, fromDate, toDate, payments }) {
    const activeRentsPromises = this.getFormattedOrders({
      type: 'rents-active',
      storeId,
      fromDate,
      toDate,
      payments
    })
    const rentsFinishedDatePromises = this.getFormattedOrders({
      type: 'rents-finished-date',
      storeId,
      fromDate,
      toDate,
      payments
    })
    const activeRepairsPromises = this.getFormattedOrders({
      type: 'repair-active',
      storeId,
      fromDate,
      toDate,
      payments
    })
    const repairsFinishedDatePromises = this.getFormattedOrders({
      type: 'repair-finished-date',
      storeId,
      fromDate,
      toDate,
      payments
    })
    const salesDatePromises = this.getFormattedOrders({
      type: 'sales-date',
      storeId,
      fromDate,
      toDate,
      payments
    })

    const [
      activeRents,
      rentsFinishedDate,
      activeRepairs,
      repairsFinishedDate,
      salesDate
    ] = await Promise.all([
      activeRentsPromises,
      rentsFinishedDatePromises,
      activeRepairsPromises,
      repairsFinishedDatePromises,
      salesDatePromises
    ])

    return {
      activeRents,
      rentsFinishedDate,
      activeRepairs,
      repairsFinishedDate,
      salesDate
    }
  }

  getPaymentsDate = async ({
    storeId,
    fromDate,
    toDate
  }: {
    storeId: string
    fromDate: Date
    toDate: Date
  }) => {
    return ServicePayments.findMany([
      where('storeId', '==', storeId),
      where('createdAt', '>=', fromDate),
      where('createdAt', '<=', toDate)
    ])
  }

  saveBalance = async (balance: Partial<StoreBalanceType>) => {
    return this.create(balance)
  }

  createV3 = async (
    storeId: string,
    ops?: {
      fromDate?: Date
      toDate?: Date
      notSave?: boolean
      progress?: (progress: number) => void
    }
  ): Promise<Partial<StoreBalanceType>> => {
    if (process.env.PRE_PRODUCTION) console.time('createV3')
    const { fromDate, toDate, progress } = ops || {}

    try {
      progress?.(1)
      const TODAY_MORNING = new Date(new Date().setHours(0, 0, 0, 0))
      const TODAY_NIGHT = new Date(new Date().setHours(23, 59, 59, 999))

      const FROM_DATE = fromDate || TODAY_MORNING
      const TO_DATE = toDate || TODAY_NIGHT

      let balance: Partial<StoreBalanceType> = {}
      balance.fromDate = FROM_DATE
      balance.toDate = TO_DATE

      //* Get payments
      const payments = await this.getPaymentsDate({
        storeId,
        fromDate: FROM_DATE,
        toDate: TO_DATE
      })
      //* Get orders
      const {
        activeRents,
        activeRepairs,
        rentsFinishedDate,
        repairsFinishedDate,
        salesDate
      } = await this.getBalanceOrders({
        storeId,
        fromDate: FROM_DATE,
        toDate: TO_DATE,
        payments
      })

      //* Get items
      const availableItems = await ServiceStoreItems.getAvailable({ storeId })

      //* Get reports
      const solvedReports = await ServiceComments.getSolvedReportsByDate({
        storeId,
        fromDate: FROM_DATE,
        toDate: TO_DATE
      })

      balance.items = availableItems.map((item) => ({
        itemId: item.id,
        itemEco: item.number
      }))
      balance.payments = payments.map((payment) => {
        return {
          id: payment.id,
          orderId: payment.orderId,
          amount: payment.amount,
          method: payment.method,
          verifiedAt: payment.verifiedAt,
          canceledAt: payment.canceledAt,
          createdBy: payment.createdBy
        }
      })
      balance.solvedReports = solvedReports
      balance.orders = [
        ...activeRents,
        ...activeRepairs,
        ...rentsFinishedDate,
        ...repairsFinishedDate,
        ...salesDate
      ]

      return balance
    } catch (error) {
      console.error('Error creating balance', error)
    }
  }
}

//#region HELPERS
const formatAsBalanceOrder = ({
  order,
  payments
}: {
  order: Partial<OrderType>
  payments: PaymentType[]
}): StoreBalanceOrder => {
  const items = order.items.map((item) => ({
    itemId: item.id,
    itemEco: item.number
  }))
  const time = order.items[0].priceSelected.time
  return {
    orderId: order?.id,
    orderType: order.type,
    orderStatus: order.status,
    orderFolio: order.folio,
    items,
    time,
    assignedSection: order.assignToSection,
    payments
  }
}

const groupOrdersBySection = ({
  orders,
  reports,
  payments,
  items,
  storeSections
}: {
  orders: Partial<OrderType>[]
  reports: Partial<CommentType>[]
  payments: PaymentType[]
  items: Partial<ItemType>[]
  storeSections?: string[]
}): Partial<BalanceType2['sections']> => {
  const WITHOUT_SECTION_NAME = 'withoutSection'
  const groupedSections = {
    all: [],
    [WITHOUT_SECTION_NAME]: [],
    ...storeSections?.reduce((acc, section) => {
      acc[section] = []
      return acc
    }, {})
  }

  // //* GROUP ORDERS BY SECTION
  orders.forEach((order) => {
    const assignToSection = order.assignToSection || WITHOUT_SECTION_NAME
    if (!groupedSections[assignToSection]) {
      groupedSections[order.assignToSection] = []
    }
    groupedSections[assignToSection].push(order)
    groupedSections.all.push(order)
  })

  //* GROUP ORDERS BY TYPE IN EACH SECTION
  const sections = Object.entries(groupedSections).map(
    ([sectionId, orders]: [string, Partial<OrderType>[]]) => {
      // *** *** ASSIGN ITEMS TO SECTION
      let inStock = items
        .filter(
          (item) => sectionId === (item.assignedSection || WITHOUT_SECTION_NAME)
        )
        .map(({ id }) => id)
      if (sectionId === 'all') {
        inStock = items.map(({ id }) => id)
      }

      const pending = orders?.filter(
        (order) => order.status === order_status.AUTHORIZED
      )
      const inRent = orders?.filter(
        (order) => order.status === order_status.DELIVERED
      )
      const reported = orders?.filter((order) =>
        reports.some((r) => r.orderId === order.id)
      )
      const reportedSolvedToday = reports.filter(
        (r) => r.solved === true && isToday(asDate(r.solvedAt))
      )

      const solvedToday = orders.filter((o) => {
        return reportedSolvedToday.some((r) => r.orderId === o.id)
      })

      const deliveredToday = orders?.filter(
        (order) =>
          order.status === order_status.DELIVERED &&
          isToday(asDate(order.deliveredAt))
      )
      const pickedUpToday = orders?.filter(
        (order) =>
          order.status === order_status.PICKED_UP &&
          isToday(asDate(order.pickedUpAt))
      )

      const renewedToday = orders.filter(
        (order) =>
          order.status === order_status.DELIVERED && isRenewedToday(order)
      )

      const renewsToday = getTodayRenews({ orders })
      const cancelledToday = orders.filter(
        (order) =>
          order.status === order_status.CANCELLED &&
          isToday(asDate(order?.cancelledAt))
      )

      const paidOrders = payments
        .filter((p) => orders.find((o) => o.id === p.orderId))
        .map(({ orderId }) => orderId)

      const getJustIds = (arr: Partial<OrderType>[]): OrderType['id'][] => {
        return arr.map(({ id }) => id)
      }

      let sectionPayments: PaymentType[] = []

      if (sectionId === 'all') {
        sectionPayments = payments
      } else {
        //? should we remove payments to other function?
        //* Filter payments that don't have an order
        sectionPayments = payments.filter(
          (p) =>
            orders.find((o) => o.id === p.orderId) || p.sectionId === sectionId
        )
      }

      return {
        cancelledToday: getJustIds(cancelledToday),
        deliveredToday: getJustIds(deliveredToday),
        pickedUpToday: getJustIds(pickedUpToday),
        section: sectionId,
        inRent: getJustIds(inRent),
        renewedToday: renewsToday.map((r) => r.orderId),
        solvedToday: getJustIds(solvedToday),
        reported: filterOutElements(
          getJustIds(reported),
          getJustIds(solvedToday)
        ),
        paidToday: paidOrders,
        payments: sectionPayments,
        inStock
      }
    }
  )

  return sections
}
const filterOutElements = (arr1: string[], arr2: string[]): string[] => {
  const set2 = new Set(arr2)
  const set1 = new Set(arr1)
  return Array.from(set1).filter((item) => !set2.has(item))
}
export const ServiceBalances = new ServiceBalancesClass()

type GetBalanceOrders = {
  type:
    | 'rents-active'
    | 'rents-finished-date'
    | 'repair-active'
    | 'repair-finished-date'
    | 'sales-date'
  storeId: string
  fromDate: Date
  toDate: Date
}
