import { limit, orderBy, where } from 'firebase/firestore'
import { FirebaseGenericService } from './genericService'
import { BalanceType2 } from '../types/BalanceType'
import { ServiceOrders } from './ServiceOrders'
import OrderType, { order_status, order_type } from '../types/OrderType'
import asDate, { endDate, startDate } from '../libs/utils-date'
import { isAfter, isBefore, isToday } from 'date-fns'
import {
  getTodayRenews,
  isRenewedToday,
  orderExtensionsBetweenDates
} from '../libs/orders'
import { ServiceComments } from './ServiceComments'
import { CommentType } from '../types/CommentType'
import { getBalancePayments } from '../libs/balance'
import PaymentType from '../types/PaymentType'
import { ServiceStoreItems } from './ServiceStoreItems'
import ItemType from '../types/ItemType'

class ServiceBalancesClass extends FirebaseGenericService<BalanceType2> {
  constructor() {
    super('balancesV2')
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

  createV2 = async (
    storeId: string,
    ops?: {
      fromDate?: Date
      toDate?: Date
      notSave?: boolean
      progress?: (progress: number) => void
      storeSections?: string[]
    }
  ): Promise<Partial<BalanceType2>> => {
    if (process.env.PRE_PRODUCTION) console.time('createV2')
    const { fromDate, toDate, progress } = ops || {}

    // CACHE OPTIONS
    const getFromCache = {
      orders: false,
      unsolvedReports: false,
      solvedReports: false,
      payments: false,
      availableItems: false,
      createdItems: false,
      retiredItems: false,
      cancelledOrders: false
    }

    try {
      progress?.(1)
      const TODAY_MORNING = new Date(new Date().setHours(0, 0, 0, 0))
      const TODAY_NIGHT = new Date(new Date().setHours(23, 59, 59, 999))

      const FROM_DATE = fromDate || TODAY_MORNING
      const TO_DATE = toDate || TODAY_NIGHT

      //* GET RENT STORE ORDERS
      const orders: Partial<OrderType>[] = await ServiceOrders.findMany(
        [
          where('storeId', '==', storeId),
          // where('type', 'in', [order_type.RENT, order_type.REPAIR])
          where('type', 'in', [order_type.RENT])
        ],
        { fromCache: getFromCache.orders }
      )

      const createdIntDate = orders.filter(
        (order) =>
          isAfter(asDate(order.createdAt), asDate(FROM_DATE)) &&
          isBefore(asDate(order.createdAt), asDate(TO_DATE))
      )
      // console.log({ createdIntDate })

      //* GET ORDER EXTENSIONS IN DATES

      const extensionsInDate = orders
        .map((order) => {
          return Object.values(order?.extensions || {})
            .map((e) => ({ ...e, orderId: order?.id }))
            .filter(
              (ext) =>
                ext.reason === 'extension' &&
                isAfter(asDate(ext.createdAt), asDate(FROM_DATE)) &&
                isBefore(asDate(ext.createdAt), asDate(TO_DATE))
            )
        })
        .flat()

      progress?.(10)

      //* GET UNSOLVED REPORTS
      const reportsUnsolved = await ServiceComments.getReportsUnsolved(
        storeId,
        { fromCache: getFromCache.unsolvedReports }
      )
      progress?.(20)
      //* GET SOLVED REPORTS
      const reportsSolvedToday = await ServiceComments.findMany(
        [
          where('type', '==', 'report'),
          where('solved', '==', true),
          where('solvedAt', '>=', FROM_DATE),
          where('solvedAt', '<=', TO_DATE)
        ],
        { fromCache: getFromCache.solvedReports }
      )
      progress?.(30)

      //* GET ALL DATE PAYMENTS
      const { payments } = await getBalancePayments(
        {
          storeId,
          fromDate: FROM_DATE,
          toDate: TO_DATE,
          section: [],
          type: 'full'
        },
        { fromCache: getFromCache.payments }
      )
      progress?.(40)

      //* GET AVAILABLE ITEMS
      const availableItems = await ServiceStoreItems.getAvailable(
        { storeId },
        { fromCache: getFromCache.availableItems }
      )
      const createItemsInDate = await ServiceStoreItems.getFieldBetweenDates(
        {
          storeId,
          field: 'createdAt',
          fromDate: FROM_DATE,
          toDate: TO_DATE
        },
        { fromCache: getFromCache.createdItems }
      )
      const retiredItemsInDate = await ServiceStoreItems.getFieldBetweenDates(
        {
          storeId,
          field: 'retiredAt',
          fromDate: FROM_DATE,
          toDate: TO_DATE
        },
        { fromCache: getFromCache.retiredItems }
      )

      const cancelledOrdersInDate = await ServiceOrders.getFieldBetweenDates(
        {
          storeId,
          field: 'cancelledAt',
          fromDate: FROM_DATE,
          toDate: TO_DATE
        },
        { justRefs: true, fromCache: getFromCache.cancelledOrders }
      )

      //* GROUP BY SECTIONS
      const groupedBySections = groupOrdersBySection({
        orders,
        reports: [...(reportsSolvedToday || []), ...(reportsUnsolved || [])],
        payments,
        items: availableItems,
        storeSections: ops?.storeSections || []
      })
      progress?.(60)

      const newBalance: Partial<BalanceType2> = {
        sections: groupedBySections,
        storeId,
        createdItems: createItemsInDate.map((i) => i.id) || [],
        retiredItems: retiredItemsInDate.map((i) => i.id) || [],
        orderExtensions: extensionsInDate,
        createdOrders: createdIntDate.map((i) => i.id) || [],
        cancelledOrders: cancelledOrdersInDate.map((i) => i.id) || []
      }

      if (ops?.notSave) {
        return newBalance
      }

      return new Promise(async (resolve) => {
        await this.create({ ...newBalance })
          .then(async (res) => {
            progress?.(80)
            await this.get(res.res.id).then((res) => {
              resolve({ ...res })
              progress?.(100)
            })
          })
          .catch((err) => {
            console.log({ err })
            progress?.(-1)
          })
      }).then((res) => res)
    } catch (error) {
      console.error(error)
    } finally {
      if (process.env.PRE_PRODUCTION) console.timeEnd('createV2')
    }
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
