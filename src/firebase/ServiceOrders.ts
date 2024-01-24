import { FieldValue, arrayUnion, where } from 'firebase/firestore'
import OrderType, { Comment } from '../types/OrderType'
import { FirebaseGenericService } from './genericService'
import { auth } from './auth'

type Type = OrderType
class ServiceOrdersClass extends FirebaseGenericService<Type> {
  constructor() {
    super('orders')
  }

  storeOrders(storeId: string, cb: CallableFunction): Promise<void> {
    return super.listenMany([where('storeId', '==', storeId)], cb)
  }

  async addComment(
    orderId: string,
    type: 'report' | 'comment',
    content: string
  ) {
    const comment: Comment = {
      type,
      content,
      createAt: new Date(),
      createdBy: auth.currentUser?.uid
    }
    // if (type === 'report') {
    //   await super
    //     .update(orderId, {
    //       status: 'REPORT'
    //     })
    //     .then(console.log)
    //     .catch(console.error)
    // }
    await super
      .update(orderId, {
        comments: arrayUnion(comment)
      })
      .then(console.log)
      .catch(console.error)
    // Implementa tu método personalizado
  }

  async report(orderId: string, content: string) {
    return this.addComment(orderId, 'report', content)
    // Implementa tu método personalizado
  }

  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

export const ServiceOrders = new ServiceOrdersClass()
