import { documentId, where } from 'firebase/firestore'
import OrderType, {
  ORDER_STATUS_SOLVED,
  ORDER_STATUS_UNSOLVED,
  TypeOrder,
  order_status
} from '../types/OrderType'
import { FirebaseGenericService } from './genericService'

import { ServiceComments } from './ServiceComments'
import { CommentType, CreateCommentType } from '../types/CommentType'
import { ServiceStores } from './ServiceStore'

type Type = OrderType

class ServiceOrdersClass extends FirebaseGenericService<Type> {
  constructor() {
    super('orders')
  }

  // async create(order: Type) {
  //   if (!order.storeId) console.error('No storeId provided')
  //   const store = await ServiceStores.get(order?.storeId)
  //   const currentFolio = store?.currentFolio || 0
  //   const nextFolio = currentFolio + 1
  //   order.folio = nextFolio
  //   ServiceStores.update(store.id, { currentFolio: nextFolio })
  //   return super.create(order)
  // }

  /**
   *
   * @param order OrderType
   * @returns orderId or null in case of error
   */
  async createSerialOrder(order: Type): Promise<string> | null {
    if (!order.storeId) console.error('No storeId provided')
    try {
      const store = await ServiceStores.get(order?.storeId)
      const currentFolio = store?.currentFolio || 0
      const nextFolio = currentFolio + 1
      order.folio = nextFolio
      /* ********************************************
       * FIRST create order
       *******************************************rz */

      const orderId = await super.create(order).then((res) => res.res.id)

      /* ********************************************
       * SECOND update store
       *******************************************rz */
      await ServiceStores.update(store.id, { currentFolio: nextFolio }).then(
        console.log
      )

      return orderId || null
    } catch (error) {
      console.log({ error })
      throw new Error('Error creating order')
    }
  }

  storeOrders(storeId: string, cb: CallableFunction): Promise<void> {
    return super.listenMany([where('storeId', '==', storeId)], cb)
  }

  async addComment({
    orderId,
    storeId,
    type,
    content
  }: {
    storeId: string
    orderId: string
    type: CommentType['type']
    content: string
  }) {
    if (!orderId) return console.error('No orderId provided')
    if (!storeId) return console.error('No storeId provided')
    if (!type) type = 'comment'
    if (!content) content = ''

    const comment: CreateCommentType = {
      orderId,
      storeId,
      type,
      content,
      solved: false
    }

    return await ServiceComments.create(comment)
      .then(console.log)
      .catch(console.error)
  }

  async report({
    orderId,
    storeId,
    content
  }: {
    orderId: string
    storeId: string
    content: string
  }) {
    return this.addComment({ orderId, type: 'report', storeId, content })
    // Implementa tu método personalizado
  }

  async updateComment(commentId, updates) {
    return await ServiceComments.update(commentId, updates)
      .then(console.log)
      .catch(console.error)
  }

  /**
   *
   * @param orderId
   * @param {total: number, info: string, repairedBy: should be a staffId}
   * @returns
   */
  async repaired(
    orderId: string,
    {
      total = 0,
      info = '',
      repairedBy = '', //* should be a userId
      repairedByStaff = '' //* should be a staffId
    }: {
      total: number
      info: string
      repairedBy: string
      repairedByStaff: string
    }
  ) {
    return await this.update(orderId, {
      status: order_status.REPAIRED,
      repairedAt: new Date(),
      repairTotal: total,
      repairInfo: info,
      repairedByStaff,
      repairedBy
    })
    // Implementa tu método personalizado
  }

  async getByStore(storeId: string) {
    return await this.findMany([where('storeId', '==', storeId)])
  }

  listenUnsolved(storeId: string, cb: CallableFunction) {
    return this.listenMany(
      [
        where('storeId', '==', storeId),
        where('status', 'in', ORDER_STATUS_UNSOLVED)
      ],
      cb
    )
  }

  getSolved(storeId: string) {
    return this.findMany([
      where('storeId', '==', storeId),
      where('status', 'in', ORDER_STATUS_SOLVED)
    ])
  }

  getUnsolved(storeId: string) {
    // ? this means that order is not solved because is in use
    //* **  An alternative it will be listen orders that are delivered but are  expired
    // FIXME: Other problem can be that oreders with status REPORTED are not getting //* Can fixed if we get all orders and after that just listen status that really matters ????

    return this.findMany([
      where('storeId', '==', storeId),
      where('status', 'in', ORDER_STATUS_UNSOLVED)
    ])
  }

  getSectionOrders(storeId: string, sections: string[]) {
    return this.findMany([
      where('storeId', '==', storeId),
      where('assignToSection', 'in', sections)
    ])
  }

  getActives(storeId: string) {
    return this.findMany([
      where('storeId', '==', storeId)
      //  where('status', 'not-in', [order_status.CANCELLED, order_status.RENEWED])
    ])
  }

  getBySections(sections: string[]) {
    return this.findMany([where('assignToSection', 'in', sections)])
  }

  getMineUnsolved(storeId: string, sections: string[]) {
    return this.findMany([
      where('storeId', '==', storeId),
      where('assignToSection', 'in', sections),
      where('status', 'in', ORDER_STATUS_UNSOLVED)
    ])
  }

  getMineSolved(storeId: string, sections: string[]) {
    return this.findMany([
      where('storeId', '==', storeId),
      where('assignToSection', 'in', sections)
    ])
  }

  getList(ids: string[], ops: { sections?: string[] } = {}) {
    const sections = ops?.sections || []
    if (!ids || ids?.length === 0) return Promise.resolve([])
    const filters = [where(documentId(), 'in', ids)]
    if (sections?.length > 0)
      filters.push(where('assignToSection', 'in', sections))
    return this.findMany(filters)
  }

  getPending(storeId: string, ops: { sections?: string[] } = {}) {
    const sections = ops?.sections || []
    const filters = [
      where('storeId', '==', storeId),
      where('status', 'in', [order_status.PENDING, order_status.AUTHORIZED])
    ]
    if (sections?.length > 0)
      filters.push(where('assignToSection', 'in', sections))
    return this.findMany(filters)
  }

  getExpired(storeId: string, ops: { sections?: string[] } = {}) {
    const sections = ops?.sections || []
    const filters = [
      where('storeId', '==', storeId),
      where('type', '==', TypeOrder.RENT),
      where('status', '==', order_status.DELIVERED),
      where('expireAt', '<', new Date())
    ]
    if (sections?.length > 0)
      filters.push(where('assignToSection', 'in', sections))
    return this.findMany(filters)
  }

  getRepairsUnsolved(storeId: string, ops: { sections?: string[] } = {}) {
    const sections = ops?.sections || []
    const filters = [
      where('storeId', '==', storeId),
      where('type', '==', TypeOrder.REPAIR),
      where('status', 'in', [
        order_status.REPAIRING,
        order_status.REPAIRED,
        order_status.PICKED_UP
      ])
    ]
    if (sections?.length > 0)
      filters.push(where('assignToSection', 'in', sections))
    return this.findMany(filters)
  }

  async getReported(storeId: string, ops: { sections?: string[] } = {}) {
    const reportsNotSolved = await ServiceComments.getReportsUnsolved(storeId)
    const uniqueOrdersIds = reportsNotSolved.reduce((acc, { orderId }) => {
      if (!acc.includes(orderId)) acc.push(orderId)
      return acc
    }, [])
    const orders = await this.getList(uniqueOrdersIds, ops)
    return orders.map((order) => ({
      ...order,
      comments: reportsNotSolved.filter(({ orderId }) => orderId === order.id)
    }))
  }
  async search(fields: string[] = [], value: string | number | boolean) {
    const promises = fields.map((field) => {
      const number = parseFloat(value as string)
      //* search as number
      if (field === 'folio') return this.findMany([where(field, '==', number)])
      //* search with phone format
      if (field === 'phone')
        return this.findMany([where(field, '==', `+52${value}`)])
      //* search as string
      return this.findMany([where(field, '==', value)])
    })
    return await Promise.all(promises).then((res) => res.flat())
  }
  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

export const ServiceOrders = new ServiceOrdersClass()
