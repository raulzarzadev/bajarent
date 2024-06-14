import { limit, orderBy, where } from 'firebase/firestore'
import BaseType from '../types/BaseType'
import OrderType from '../types/OrderType'
import { ServiceOrders } from './ServiceOrders'
import { FirebaseGenericService } from './genericService'
import asDate from '../libs/utils-date'
type Type = ConsolidatedStoreOrdersType

class ConsolidatedOrdersClass extends FirebaseGenericService<Type> {
  constructor() {
    super('consolidatedOrders')
  }

  async consolidate(storeId: string) {
    console.log({ storeId })
    const storeOrders = await ServiceOrders.getByStore(storeId)
    console.log({ storeOrders })
    const mapOrders = formatConsolidateOrders(storeOrders)
    console.log({ mapOrders })
    return this.create({
      storeId,
      orders: {},
      stringJSON: JSON.stringify(mapOrders),
      ordersCount: storeOrders.length
    })
  }

  async getByStore(storeId: string) {
    return this.findMany([
      where('storeId', '==', storeId),
      orderBy('createdAt', 'desc'),
      limit(1)
    ])
  }
  async listenByStore(storeId: string, cb: CallableFunction) {
    return this.listenMany(
      [where('storeId', '==', storeId), orderBy('createdAt', 'desc'), limit(1)],
      cb
    )
  }

  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

//#region FUNCTIONS
const formatConsolidateOrder = (
  order: OrderType
): Omit<
  Partial<OrderType>,
  'createdAt' | 'expireAt' | 'pickedUpAt' | 'deliveredAt'
> & {
  createdAt: string | null
  expireAt: string | null
  pickedUpAt: string | null
  deliveredAt: string | null
} => {
  return {
    fullName: order?.fullName || '',
    phone: order?.phone || '',
    email: order?.email || '',
    id: order?.id || '',
    status: order?.status,
    folio: order?.folio || 0,
    note: order?.note || '',
    address: order?.address || '',
    type: order?.type,
    references: order?.references || '',
    location: order?.location || '',
    items: order?.items || [],
    neighborhood: order?.neighborhood || '',
    assignToSection: order?.assignToSection || '',
    expireAt: order?.expireAt ? asDate(order?.expireAt).toISOString() : null,
    createdAt: order?.createdAt ? asDate(order?.createdAt).toISOString() : null,
    pickedUpAt: order?.pickedUpAt
      ? asDate(order?.pickedUpAt).toISOString()
      : null,
    deliveredAt: order?.deliveredAt
      ? asDate(order?.deliveredAt).toISOString()
      : null,
    colorLabel: order?.colorLabel || ''
  }
}

const formatConsolidateOrders = (orders: OrderType[]) => {
  return orders.reduce((acc, order) => {
    acc[order.id] = formatConsolidateOrder(order)
    return acc
  }, {} as ConsolidatedStoreOrdersType['orders'])
}
//#region TYPES
export type ConsolidatedOrderType = ReturnType<typeof formatConsolidateOrder>

export type ConsolidatedStoreOrdersType = {
  storeId: string
  orders: { [key: OrderType['id']]: ConsolidatedOrderType }
  ordersCount: number
  stringJSON: string
} & BaseType

export const ServiceConsolidatedOrders = new ConsolidatedOrdersClass()
