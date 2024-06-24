import { limit, orderBy, where } from 'firebase/firestore'
import BaseType from '../types/BaseType'
import OrderType from '../types/OrderType'
import { ServiceOrders } from './ServiceOrders'
import { FirebaseGenericService } from './genericService'
import asDate from '../libs/utils-date'
import { ServiceChunks } from './ServiceChunks'
type Type = ConsolidatedStoreOrdersType

class ConsolidatedOrdersClass extends FirebaseGenericService<Type> {
  constructor() {
    super('consolidatedOrders')
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

  async consolidate(storeId: string) {
    //* 1. get all data
    const storeOrders = await ServiceOrders.getByStore(storeId)
    //* 2. format data
    const mapOrders = formatConsolidateOrders(storeOrders)
    //* 3. split data in chunks
    const chunks = splitOrdersCount(500, Object.values(mapOrders))
    //* 4. create chunks
    const promisesChunks = chunks.map(async (chunk) => {
      const obj = chunk.reduce((acc, order) => {
        acc[order.id] = order
        return acc
      }, {} as ConsolidatedStoreOrdersType['orders'])

      return await ServiceChunks.create({
        storeId,
        orders: obj
      }).then(({ res }) => res.id)
    })
    const createdChunks = await Promise.all(promisesChunks)
    //* 5. create consolidate with chunks
    await this.create({
      storeId,
      orders: {},
      consolidatedChunks: createdChunks,
      stringJSON: '{}',
      ordersCount: storeOrders.length
    })
  }

  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

const splitOrdersCount = (count: number = 500, orders: any[]) => {
  const chunks = []
  while (orders.length) {
    chunks.push(orders.splice(0, count))
  }
  return chunks
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
    //email: order?.email || '',
    id: order?.id || '',
    status: order?.status,
    folio: order?.folio || 0,
    note: order?.note || '',
    //address: order?.address || '',
    type: order?.type,
    //references: order?.references || '',
    location: order?.location || '',
    items: order?.items || [],
    neighborhood: order?.neighborhood || '',
    assignToSection: order?.assignToSection || '',
    // @ts-ignore
    expireAt: order?.expireAt ? asDate(order?.expireAt).getTime() : null,
    // @ts-ignore
    createdAt: order?.createdAt ? asDate(order?.createdAt).getTime() : null,
    // @ts-ignore
    pickedUpAt: order?.pickedUpAt ? asDate(order?.pickedUpAt).getTime() : null,
    // @ts-ignore
    deliveredAt: order?.deliveredAt
      ? asDate(order?.deliveredAt).getTime()
      : null
    //colorLabel: order?.colorLabel || ''
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
  consolidatedChunks: string[]
} & BaseType

export const ServiceConsolidatedOrders = new ConsolidatedOrdersClass()
