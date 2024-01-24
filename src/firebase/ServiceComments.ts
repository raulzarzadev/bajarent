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
}

export const ServiceComments = new ServiceOrdersClass()
