import { where } from 'firebase/firestore'
import OrderType from '../types/OrderType'
import { FirebaseGenericService } from './genericService'

import ShortUniqueId from 'short-unique-id'
import { ServiceComments } from './ServiceComments'
import { CommentType, CreateCommentType } from '../types/CommentType'
import { ServiceStores } from './ServiceStore'

const uid = new ShortUniqueId()

type Type = OrderType
class ServiceOrdersClass extends FirebaseGenericService<Type> {
  constructor() {
    super('orders')
  }

  async create(order: Type) {
    const currentFolio = ServiceStores.get
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
      content
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

  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

export const ServiceOrders = new ServiceOrdersClass()
