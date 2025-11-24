import { limit, orderBy, QueryConstraint, where } from 'firebase/firestore'
import { comment_variant, CommentType } from '../types/CommentType'
import { FirebaseGenericService } from './genericService'
import { GetItemsOps } from './firebase.CRUD'

type Type = CommentType

class ServiceOrdersClass extends FirebaseGenericService<Type> {
  constructor() {
    super('comments')
  }

  create(comment: Partial<Type>) {
    return super.create({ ...comment, solved: false })
  }

  orderComments(orderId: string, cb: CallableFunction) {
    return super.listenMany(
      [
        where('orderId', '==', orderId),
        orderBy('createdAt', 'desc') // Ordenar por el campo 'createdAt' en orden descendente
      ],
      cb
    )
  }

  storeComments(storeId: string, cb: CallableFunction) {
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

  async getByOrder(orderId: string, { count = 999 } = {}) {
    return await this.findMany([where('orderId', '==', orderId), limit(count)])
  }

  getLast(storeId: string, count: number) {
    return this.findMany([
      where('storeId', '==', storeId),
      orderBy('createdAt', 'desc'),
      limit(count)
    ])
  }

  listenLastByOrder({
    count,
    cb,
    orderId
  }: {
    orderId: string
    count: number
    cb: CallableFunction
  }) {
    return this.listenMany(
      [
        where('orderId', '==', orderId),
        orderBy('createdAt', 'desc'),
        limit(count)
      ],
      cb
    )
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

  listenImportantUnsolved(storeId: string, cb: CallableFunction) {
    return this.listenMany(
      [
        where('storeId', '==', storeId),
        where('type', '==', 'important'),
        where('solved', '==', false)
      ],
      cb
    )
  }

  getReportsAndImportantUnsolvedByOrder(orderId: string) {
    return this.findMany([
      where('orderId', '==', orderId),
      where('type', 'in', ['report', 'important']),
      where('solved', '==', false)
    ])
  }

  getReportsUnsolved(storeId: string, ops?: GetItemsOps) {
    return this.findMany(
      [
        where('storeId', '==', storeId),
        where('type', '==', 'report'),
        where('solved', '==', false)
      ],
      ops
    )
  }

  getOrderUnsolvedReports(orderId) {
    return this.findMany([
      where('orderId', '==', orderId),
      where('type', '==', 'report'),
      where('solved', '==', false)
    ])
  }

  getUnsolvedImportantAndReports(storeId: string) {
    return this.findMany([
      where('storeId', '==', storeId),
      where('type', 'in', ['report', 'important']),
      where('solved', '==', false)
    ])
  }

  getOrderUnsolvedImportant(orderId) {
    return this.findMany([
      where('orderId', '==', orderId),
      where('type', '==', 'important'),
      where('solved', '==', false)
    ])
  }
  getToday(storeId) {
    return this.findMany([
      where('storeId', '==', storeId),
      where('createdAt', '>=', new Date(new Date().setHours(0, 0, 0, 0))),
      where('createdAt', '<=', new Date(new Date().setHours(23, 59, 59, 999)))
    ])
  }
  getByDate(storeId: string, date: Date = new Date(), ops?: GetItemsOps) {
    return this.findMany(
      [
        where('storeId', '==', storeId),
        where('createdAt', '>=', new Date(date.setHours(0, 0, 0, 0))),
        where('createdAt', '<=', new Date(date.setHours(23, 59, 59, 999)))
      ],
      ops
    )
  }
  orderReports(orderId: string) {
    return this.findMany([
      where('orderId', '==', orderId),
      where('type', '==', 'report'),
      where('solved', '==', false)
    ])
  }
  listenOrderReports(orderId: string, cb: CallableFunction) {
    return this.listenMany(
      [
        where('orderId', '==', orderId),
        where('type', 'in', ['report', 'important']),
        where('solved', '==', false)
      ],
      cb
    )
  }
  listenReports(storeId: string, cb: CallableFunction) {
    return this.listenMany(
      [
        where('storeId', '==', storeId),
        where('type', '==', 'report')
        // where('solved', '==', false)
      ],
      cb
    )
  }
  getSolvedReports(storeId: string) {
    const filters = [
      where('storeId', '==', storeId),
      where('type', '==', 'report'),
      where('solved', '==', true)
    ]
    return this.findMany(filters)
  }
  getSolvedReportsByDate({ storeId, fromDate, toDate }) {
    return this.findMany([
      where('storeId', '==', storeId),
      where('type', '==', 'report'),
      where('solved', '==', true),
      where('solvedAt', '>=', fromDate),
      where('solvedAt', '<=', toDate)
    ])
  }
  getWorkshopDateMovements({ fromDate, toDate, storeId }): Promise<Type[]> {
    let commentFilters: QueryConstraint[] = [
      orderBy('createdAt', 'desc'),
      where('storeId', '==', storeId),
      where('createdAt', '>=', fromDate),
      where('createdAt', '<=', toDate),
      where('variant', '==', comment_variant.workshop_flow)
    ]
    return this.findMany(commentFilters)
  }
  getLastByOrder({ orderId, count }: { orderId: string; count: number }) {
    return this.findMany([
      where('orderId', '==', orderId),
      orderBy('createdAt', 'desc'),
      limit(count)
    ])
  }
  getReports({
    storeId,
    solvedToday = false,
    solved
  }: {
    storeId: string
    solvedToday?: boolean
    solved?: boolean
  }) {
    let filters = [
      where('storeId', '==', storeId),
      where('type', '==', 'report')
    ]
    if (solved !== undefined) {
      filters.push(where('solved', '==', solved))
    }
    if (solvedToday) {
      filters.push(
        where('solvedAt', '>=', new Date(new Date().setHours(0, 0, 0, 0))),
        where('solvedAt', '<=', new Date(new Date().setHours(23, 59, 59, 999)))
      )
    }
    return this.findMany(filters)
  }
}

export const ServiceComments = new ServiceOrdersClass()
