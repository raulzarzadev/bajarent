import { limit, orderBy, where } from 'firebase/firestore'
import { FirebaseGenericService } from './genericService'
import { BalanceType2 } from '../types/BalanceType'
import { ServiceOrders } from './ServiceOrders'
import OrderType, { order_status, order_type } from '../types/OrderType'
import asDate, { endDate, startDate } from '../libs/utils-date'
import { isToday } from 'date-fns'
import { isRenewedToday } from '../libs/orders'
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
      cb
    )
  }

  createV2 = async (
    storeId: string,
    ops?: {
      fromDate?: Date
      toDate?: Date
      notSave?: boolean
      progress?: (progress: number) => void
    }
  ): Promise<Partial<BalanceType2>> => {
    const { fromDate, toDate, progress } = ops || {}

    try {
      progress?.(1)
      const TODAY_MORNING = new Date(new Date().setHours(0, 0, 0, 0))
      const TODAY_NIGHT = new Date(new Date().setHours(23, 59, 59, 999))

      const FROM_DATE = fromDate || TODAY_MORNING
      const TO_DATE = toDate || TODAY_NIGHT

      const orders = await ServiceOrders.findMany([
        where('storeId', '==', storeId),
        where('type', '==', order_type.RENT)
      ])
      progress?.(10)

      const reportsUnsolved = await ServiceComments.getReportsUnsolved(storeId)
      progress?.(20)
      const reportsSolvedToday = await ServiceComments.findMany([
        where('type', '==', 'report'),
        where('solved', '==', true),
        where('solvedAt', '>=', FROM_DATE),
        where('solvedAt', '<=', TO_DATE)
      ])
      progress?.(30)
      const { payments } = await getBalancePayments({
        storeId,
        fromDate: FROM_DATE,
        toDate: TO_DATE,
        section: [],
        type: 'full'
      })
      progress?.(40)

      const itemsBySections = await ServiceStoreItems.getAvailable({ storeId })
      progress?.(50)
      const groupedBySections = groupOrdersBySection({
        orders,
        reports: [...(reportsSolvedToday || []), ...(reportsUnsolved || [])],
        payments,
        items: itemsBySections
      })
      progress?.(60)
      const newBalance = {
        sections: groupedBySections,
        storeId
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
    }
  }
}

const groupOrdersBySection = ({
  orders,
  reports,
  payments,
  items
}: {
  orders: Partial<OrderType>[]
  reports: Partial<CommentType>[]
  payments: PaymentType[]
  items: Partial<ItemType>[]
}): Partial<BalanceType2['sections']> => {
  const groupedSections = {
    all: [],
    withoutSection: []
  }

  orders.forEach((order) => {
    const assignToSection = order.assignToSection || 'withoutSection'
    if (!groupedSections[assignToSection]) {
      groupedSections[order.assignToSection] = []
    }
    groupedSections[assignToSection].push(order)
    groupedSections.all.push(order)
  })

  const sections = Object.entries(groupedSections).map(
    ([sectionId, orders]: [string, Partial<OrderType>[]]) => {
      // *** *** ASSIGN ITEMS TO SECTION
      let inStock = items
        .filter(
          (item) => sectionId === (item.assignedSection || 'withoutSection')
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
      const removeDuplicates = (arr: Partial<OrderType>[]) => {
        const map = new Map()
        arr.forEach((item) => {
          map.set(item.id, item)
        })
        return Array.from(map.values())
      }

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
        renewedToday: getJustIds(renewedToday),
        reported: getJustIds(reported),
        pending: getJustIds(pending),
        solvedToday: getJustIds(removeDuplicates(solvedToday)),
        paidToday: paidOrders,
        payments: sectionPayments,
        inStock
      }
    }
  )

  return sections
}

export const ServiceBalances = new ServiceBalancesClass()
