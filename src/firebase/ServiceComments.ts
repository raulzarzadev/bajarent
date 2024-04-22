import { limit, orderBy, where } from 'firebase/firestore'
import { CommentType } from '../types/CommentType'
import { FirebaseGenericService } from './genericService'

type Type = CommentType

class ServiceOrdersClass extends FirebaseGenericService<Type> {
  constructor() {
    super('comments')
  }

  create(comment: Partial<Type>) {
    return super.create({ ...comment, solved: false })
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

  async getByStore(storeId: string) {
    return await this.findMany([where('storeId', '==', storeId)])
  }

  listenStoreReports(storeId: string, cb: CallableFunction) {
    return this.listenMany(
      [
        where('storeId', '==', storeId),
        where('type', '==', 'report')
        // where('solved', '==', false)
      ],
      cb
    )
  }

  async getByOrder(orderId: string) {
    return await this.findMany([where('orderId', '==', orderId)])
  }

  getLast(storeId: string, count: number) {
    return this.findMany([
      where('storeId', '==', storeId),
      orderBy('createdAt', 'desc'),
      limit(count)
    ])
  }

  listenByOrder(orderId: string, cb: CallableFunction) {
    return this.listenMany([where('orderId', '==', orderId)], cb)
  }

  listenLastComments(ops: { storeId: string; count: number }, cb) {
    return this.listenMany(
      [
        where('storeId', '==', ops?.storeId),
        orderBy('createdAt', 'desc'),
        where('type', '==', 'comment'),
        limit(ops.count)
      ],
      cb
    )
  }

  listenLastReports(
    ops: { storeId: string; count: number; solved: boolean },
    cb
  ) {
    const storeId = ops?.storeId
    return this.listenMany(
      [
        where('storeId', '==', storeId),
        where('type', '==', 'report'),
        // where('solved', 'in', [ops.solved, null, undefined]),
        orderBy('createdAt', 'desc'),
        limit(ops.count)
      ],
      cb
    )
  }

  listenReportsUnsolved(storeId: string, cb: CallableFunction) {
    return this.listenMany(
      [
        where('storeId', '==', storeId),
        where('type', '==', 'report'),
        where('solved', '==', false)
      ],
      cb
    )
  }
}

export const ServiceComments = new ServiceOrdersClass()
