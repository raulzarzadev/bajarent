import { orderBy, where } from 'firebase/firestore'
import { CommentType } from '../types/CommentType'
import { FirebaseGenericService } from './genericService'

type Type = CommentType

class ServiceOrdersClass extends FirebaseGenericService<Type> {
  constructor() {
    super('comments')
  }

  orderComments(orderId: string, cb: CallableFunction): Promise<void> {
    return super.listenMany(
      [
        where('orderId', '==', orderId),
        orderBy('createdAt', 'desc') // Ordenar por el campo 'createdAt' en orden descendente
      ],
      cb
    )
  }

  storeComments(storeId: string, cb: CallableFunction): Promise<void> {
    return super.listenMany([where('storeId', '==', storeId)], cb)
  }

  deleteOrderComments(orderId: string) {
    return super.deleteMany([where('orderId', '==', orderId)])
  }
}

export const ServiceComments = new ServiceOrdersClass()
