import { limit, orderBy, where } from 'firebase/firestore'
import { FirebaseGenericService } from './genericService'
import { ServiceOrders } from './ServiceOrders'
import OrderType, { order_status, order_type } from '../types/OrderType'
import asDate, { endDate, startDate } from '../libs/utils-date'
import { isAfter } from 'date-fns'
import { ServiceComments } from './ServiceComments'
import PaymentType from '../types/PaymentType'
import { ServiceStoreItems } from './ServiceStoreItems'
import { StoreBalanceOrder, StoreBalanceType } from '../types/StoreBalance'
import { ServicePayments } from './ServicePayments'
import ItemType from '../types/ItemType'

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
    cb: (data: StoreBalanceType) => void
  ) {
    return this.listenMany(
      [
        where('storeId', '==', storeId),
        where('createdAt', '<=', endDate(date)),
        where('createdAt', '>=', startDate(date)),
        orderBy('createdAt', 'desc'),
        limit(1)
      ],
      (res) => {
        console.log(res)
        cb(res?.[0] || null)
      }
    )
  }

  async getOrders({ type, storeId, fromDate, toDate }: GetBalanceOrders) {
    if (type === 'canceled-date') {
      return ServiceOrders.findMany([
        where('storeId', '==', storeId),
        where('status', '==', order_status.CANCELLED),
        where('cancelledAt', '>=', startDate(fromDate)),
        where('cancelledAt', '<=', endDate(toDate))
      ])
    }
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
    return this.getOrders(props)
  }

  async getBalanceOrders({ storeId, fromDate, toDate, payments }) {
    const activeRentsPromises = this.getOrders({
      type: 'rents-active',
      storeId,
      fromDate,
      toDate
    })
    const rentsFinishedDatePromises = this.getOrders({
      type: 'rents-finished-date',
      storeId,
      fromDate,
      toDate
    })
    const canceledOrdersPromises = this.getOrders({
      type: 'canceled-date',
      storeId,
      fromDate,
      toDate
    })
    const activeRepairsPromises = this.getOrders({
      type: 'repair-active',
      storeId,
      fromDate,
      toDate
    })
    const repairsFinishedDatePromises = this.getOrders({
      type: 'repair-finished-date',
      storeId,
      fromDate,
      toDate
    })
    const salesDatePromises = this.getOrders({
      type: 'sales-date',
      storeId,
      fromDate,
      toDate
    })

    const [
      activeRents,
      rentsFinishedDate,
      activeRepairs,
      repairsFinishedDate,
      salesDate,
      canceledOrders
    ] = await Promise.all([
      activeRentsPromises,
      rentsFinishedDatePromises,
      activeRepairsPromises,
      repairsFinishedDatePromises,
      salesDatePromises,
      canceledOrdersPromises
    ])

    return {
      activeRents,
      rentsFinishedDate,
      activeRepairs,
      repairsFinishedDate,
      salesDate,
      canceledOrders
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
    console.log({ balance })
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
    console.time('createV3')
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
      balance.storeId = storeId

      //* Get payments
      const payments: PaymentType[] = await this.getPaymentsDate({
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
        salesDate,
        canceledOrders
      } = await this.getBalanceOrders({
        storeId,
        fromDate: FROM_DATE,
        toDate: TO_DATE,
        payments
      })

      //* Get items
      const availableItems: ItemType[] = await ServiceStoreItems.getAvailable({
        storeId
      })

      balance.items = availableItems?.map((item) => ({
        itemId: item.id,
        itemEco: item.number,
        assignedSection: item.assignedSection || null,
        categoryId: item.category || null
      }))

      balance.payments = payments?.map((payment) => {
        return {
          id: payment.id,
          orderId: payment.orderId || null,
          amount: payment.amount,
          method: payment.method,
          verifiedAt: payment.verifiedAt || null,
          canceledAt: payment.canceledAt || null,
          createdBy: payment.createdBy,
          type: payment?.type || null,
          ...payment
        }
      })

      const orders = [
        ...activeRents,
        ...activeRepairs,
        ...rentsFinishedDate,
        ...repairsFinishedDate,
        ...salesDate,
        ...canceledOrders
      ]

      balance.orders = orders
        //* format orders
        .map((order) =>
          formatAsBalanceOrder({
            order,
            payments: payments.filter((payment) => payment.orderId === order.id)
          })
        )
        //* remove duplicated orders
        .filter(
          (order, index, self) =>
            index === self.findIndex((t) => t.orderId === order.orderId)
        )

      //* Get reports
      const solvedReports = await ServiceComments.getSolvedReportsByDate({
        storeId,
        fromDate: FROM_DATE,
        toDate: TO_DATE
      })

      balance.solvedReports = solvedReports

      console.timeEnd('createV3')
      return balance
    } catch (error) {
      console.timeEnd('createV3')
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
  const items =
    order?.items?.map((item) => ({
      itemId: item?.id,
      itemEco: item?.number || null,
      categoryName: item?.categoryName || null,
      priceId: item?.priceSelected?.id || null
    })) || null
  const time = order?.items?.[0]?.priceSelected?.time || null

  //get last extension
  const lastExtension =
    Object.values(order?.extensions || {}).sort((a, b) =>
      isAfter(asDate(a.createdAt), asDate(b.createdAt)) ? -1 : 1
    )[0]?.createdAt || null

  return {
    orderId: order?.id,
    orderType: order?.type,
    orderStatus: order?.status,
    orderFolio: order?.folio,
    canceledAt:
      order?.status === order_status?.CANCELLED ? order?.cancelledAt : null,
    items,
    renewedAt: lastExtension,
    deliveredAt: order?.deliveredAt || null,
    time,
    assignedSection: order?.assignToSection || null,
    payments,
    clientName: order?.fullName
  }
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
    | 'canceled-date'
  storeId: string
  fromDate: Date
  toDate: Date
}
