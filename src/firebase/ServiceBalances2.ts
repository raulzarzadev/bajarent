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

  createV2 = async (storeId: string): Promise<Partial<BalanceType2>> => {
    try {
      const TODAY_MORNING = new Date(new Date().setHours(0, 0, 0, 0))
      const TODAY_NIGHT = new Date(new Date().setHours(23, 59, 59, 999))

      const orders = await ServiceOrders.findMany([
        where('storeId', '==', storeId),
        where('type', '==', order_type.RENT)
      ])

      const reportsUnsolved = await ServiceComments.getReportsUnsolved(storeId)

      const reportsSolvedToday = await ServiceComments.findMany([
        where('type', '==', 'report'),
        where('solved', '==', true),
        where('solvedAt', '>=', TODAY_MORNING),
        where('solvedAt', '<=', TODAY_NIGHT)
      ])

      const { payments } = await getBalancePayments({
        storeId,
        fromDate: TODAY_MORNING,
        toDate: TODAY_NIGHT,
        section: [],
        type: 'full'
      })

      const groupedBySections = groupOrdersBySection({
        orders,
        reports: [...(reportsSolvedToday || []), ...(reportsUnsolved || [])],
        payments
      })
      const newBalance = {
        sections: groupedBySections,
        storeId
      }

      return new Promise(async (resolve) => {
        console.log({ newBalance })
        await this.create({ ...newBalance })
          .then((res) => {
            this.get(res.res.id).then((res) => {
              resolve({ ...res })
            })
          })
          .catch((err) => console.log({ err }))
      })
    } catch (error) {
      console.error(error)
    }
  }
}

const groupOrdersBySection = ({
  orders,
  reports,
  payments
}: {
  orders: Partial<OrderType>[]
  reports: Partial<CommentType>[]
  payments: PaymentType[]
}): Partial<BalanceType2['sections']> => {
  const res = {
    all: [],
    withoutSection: []
  }

  orders.forEach((order) => {
    const assignToSection = order.assignToSection || 'withoutSection'
    if (!res[assignToSection]) {
      res[order.assignToSection] = []
    }
    res[assignToSection].push(order)
    res.all.push(order)
  })

  const sections = Object.entries(res).map(
    ([key, orders]: [string, Partial<OrderType>[]]) => {
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

      const sectionPayments = payments.filter((p) =>
        orders.find((o) => o.id === p.orderId)
      )

      return {
        cancelledToday: getJustIds(cancelledToday),
        deliveredToday: getJustIds(deliveredToday),
        pickedUpToday: getJustIds(pickedUpToday),
        section: key,
        inRent: getJustIds(inRent),
        renewedToday: getJustIds(renewedToday),
        reported: getJustIds(reported),
        pending: getJustIds(pending),
        solvedToday: getJustIds(removeDuplicates(solvedToday)),
        paidToday: paidOrders,
        payments: sectionPayments
      }
    }
  )

  return sections
}

export const ServiceBalances = new ServiceBalancesClass()
