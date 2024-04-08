import { where } from 'firebase/firestore'
import OrderType, {
  ORDER_STATUS_SOLVED,
  ORDER_STATUS_UNSOLVED,
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

  async create(order: Type) {
    if (!order.storeId) console.error('No storeId provided')
    const store = await ServiceStores.get(order?.storeId)
    const currentFolio = store?.currentFolio || 0
    const nextFolio = currentFolio + 1
    ServiceStores.update(store.id, { currentFolio: nextFolio })
    order.folio = nextFolio
    return super.create(order)
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

  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

export const ServiceOrders = new ServiceOrdersClass()
