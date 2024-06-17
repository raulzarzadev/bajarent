import { where } from 'firebase/firestore'
import { FirebaseGenericService } from './genericService'
import { BalanceType, BalanceType2 } from '../types/BalanceType'
import { ServiceOrders } from './ServiceOrders'
import OrderType, { order_status } from '../types/OrderType'
class ServiceBalancesClass extends FirebaseGenericService<BalanceType> {
  constructor() {
    super('balances')
  }

  async getByStore(storeId: string) {
    return this.getItems([where('storeId', '==', storeId)])
  }

  createV2 = async (storeId: string): Promise<BalanceType2 | void> => {
    const authorized = await ServiceOrders.findMany([
      where('storeId', '==', storeId),
      where('status', '==', order_status.AUTHORIZED)
    ])

    const delivered = await ServiceOrders.findMany([
      where('storeId', '==', storeId),
      where('status', '==', 'delivered')
    ])
    const cancelled = await ServiceOrders.findMany([
      where('storeId', '==', storeId),
      where('status', '==', 'cancelled')
    ])

    // const renewedOrders = ServiceOrders.findMany([
    //   where('storeId', '==', storeId),
    //   where('status', '==', 'renewed')
    // ])
    // const reports = ServiceOrders.findMany([
    //   where('storeId', '==', storeId),
    //   where('status', '==', 'reported')
    // ])
    // const pickedUpOrders = ServiceOrders.findMany([
    //   where('storeId', '==', storeId),
    //   where('status', '==', 'pickedUp')
    // ])
    // const rentedOrders = ServiceOrders.findMany([
    //   where('storeId', '==', storeId),
    //   where('status', '==', 'rented')
    // ])
    // const inStockOrders = ServiceOrders.findMany([
    //   where('storeId', '==', storeId),
    //   where('status', '==', 'inStock')
    // ])

    const deliveredOrders = groupOrdersBySection(delivered)
    const pendingOrders = groupOrdersBySection(authorized)
    const cancelledOrders = groupOrdersBySection(cancelled)
    console.log({ pendingOrders, deliveredOrders, cancelledOrders })
    return
  }
}

const groupOrdersBySection = (
  orders: Partial<OrderType>[]
): {
  [key: string]: Partial<OrderType>[]
} => {
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
  return res
}

export const ServiceBalances = new ServiceBalancesClass()
