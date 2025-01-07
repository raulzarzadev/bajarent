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
    if (type === 'repair-delivered-at') {
      return ServiceOrders.findMany([
        where('storeId', '==', storeId),
        where('type', '==', order_type.REPAIR),
        where('status', '==', order_status.DELIVERED),
        where('deliveredAt', '>=', startDate(fromDate)),
        where('deliveredAt', '<=', endDate(toDate))
      ])
    }

    if (type === 'repair-started-at') {
      return ServiceOrders.findMany([
        where('storeId', '==', storeId),
        where('type', '==', order_type.REPAIR),
        //  where('status', '==', order_status.REPAIRED),
        where('repairingAt', '>=', startDate(fromDate)),
        where('repairingAt', '<=', endDate(toDate))
      ])
    }

    if (type === 'sales-delivered-at') {
      return ServiceOrders.findMany([
        where('storeId', '==', storeId),
        where('type', '==', order_type.SALE),
        // where('status', '==', order_status.DELIVERED),
        where('deliveredAt', '>=', startDate(fromDate)),
        where('deliveredAt', '<=', endDate(toDate))
      ])
    }
    if (type === 'sales-paid-at') {
      return ServiceOrders.findMany([
        where('storeId', '==', storeId),
        where('type', '==', order_type.SALE),
        // where('status', '==', order_status.DELIVERED),
        where('paidAt', '>=', startDate(fromDate)),
        where('paidAt', '<=', endDate(toDate))
      ])
    }
    if (type === 'sales-created-at') {
      return ServiceOrders.findMany([
        where('storeId', '==', storeId),
        where('type', '==', order_type.SALE),
        where('createdAt', '>=', startDate(fromDate)),
        where('createdAt', '<=', endDate(toDate))
      ])
    }
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
    const repairStartedAtPromises = this.getOrders({
      type: 'repair-started-at',
      storeId,
      fromDate,
      toDate
    })
    const repairDeliveredAtPromises = this.getOrders({
      type: 'repair-delivered-at',
      storeId,
      fromDate,
      toDate
    })
    // const salesDeliveredPromises = this.getOrders({
    //   type: 'sales-delivered-at',
    //   storeId,
    //   fromDate,
    //   toDate
    // })
    const salesPaidPromises = this.getOrders({
      type: 'sales-paid-at',
      storeId,
      fromDate,
      toDate
    })
    const salesCreatedPromises = this.getOrders({
      type: 'sales-created-at',
      storeId,
      fromDate,
      toDate
    })

    const [
      activeRents,
      rentsFinishedDate,
      repairStartedAt,
      repairsDeliveredAt,
      canceledOrders,
      salesCreated,
      salesPaid
      //salesDate,
    ] = await Promise.all([
      activeRentsPromises,
      rentsFinishedDatePromises,
      repairStartedAtPromises,
      repairDeliveredAtPromises,
      canceledOrdersPromises,
      salesCreatedPromises,
      salesPaidPromises
      //  salesDeliveredPromises,
    ])

    //join orders
    const allOrders = [
      activeRents,
      rentsFinishedDate,
      repairStartedAt,
      repairsDeliveredAt,
      canceledOrders,
      salesCreated,
      salesPaid
      //salesDate,
    ].flat()
    // remove duplicated orders
    const unique = allOrders.filter(
      (order, index, self) => index === self.findIndex((t) => t.id === order.id)
    )
    return unique
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
      progress?: (progress: number) => void
    }
  ): Promise<StoreBalanceType> => {
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
      progress?.(10)
      //* Get orders

      const orders = await this.getBalanceOrders({
        storeId,
        fromDate: FROM_DATE,
        toDate: TO_DATE,
        payments
      })
      progress?.(40)

      //* Get items
      const availableItems: ItemType[] = await ServiceStoreItems.getAvailable({
        storeId
      })

      const retiredItems: ItemType[] =
        await ServiceStoreItems.getFieldBetweenDates({
          storeId,
          field: 'retiredAt',
          fromDate: FROM_DATE,
          toDate: TO_DATE
        })
      progress?.(60)

      const formattedItems = [...availableItems, ...retiredItems].map(
        (item) => ({
          itemId: item?.id || null,
          itemEco: item?.number || null,
          assignedSection: item?.assignedSection || null,
          categoryId: item?.category || null,
          retiredAt: item?.retiredAt || null
        })
      )

      balance.items = formattedItems

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

      progress?.(70)

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
      progress?.(80)

      balance.solvedReports = solvedReports

      console.timeEnd('createV3')
      progress?.(100)

      return balance as StoreBalanceType
    } catch (error) {
      progress?.(-1)
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
    order?.items?.map((item) => {
      return {
        itemId: item?.id || null,
        itemEco: item?.number || null,
        categoryName: item?.categoryName || null,
        priceId: item?.priceSelected?.id || null,
        orderId: order.id || null,
        assignedSection: order.assignToSection || null,
        orderFolio: order.folio || null
      }
    }) || null
  const time = order?.items?.[0]?.priceSelected?.time || null

  //get last extension not renew
  const lastExtension =
    Object.values(order?.extensions || {})
      .filter((ext) => ext.reason !== 'renew')
      .sort((a, b) =>
        isAfter(asDate(a.createdAt), asDate(b.createdAt)) ? -1 : 1
      )[0]?.createdAt || null
  // get last renewal
  const lastRenew =
    Object.values(order?.extensions || {})
      .filter((ext) => ext.reason === 'renew')
      .sort((a, b) =>
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
    renewedAt: lastRenew,
    extendedAt: lastExtension,
    deliveredAt: order?.deliveredAt || null,
    time,
    assignedSection: order?.assignToSection || null,
    payments,
    clientName: order?.fullName,
    orderNote: order?.note || null,
    repairingAt: order?.repairingAt || null,
    paidAt: order?.paidAt || null,
    createdAt: order?.createdAt || null
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
    //*<-- about repairs
    | 'repair-started-at'
    | 'repair-delivered-at'
    //* <--- about sales
    | 'sales-delivered-at'
    | 'sales-paid-at'
    | 'sales-created-at'
    //* <-- general
    | 'canceled-date'
    | 'paid-at'
  storeId: string
  fromDate: Date
  toDate: Date
}
