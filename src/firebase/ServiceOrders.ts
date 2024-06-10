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
import { addDays } from 'date-fns'
import { createUUID } from '../libs/createId'
import { auth } from './auth'
import { expireDate2 } from '../libs/expireDate'
import { PriceType } from '../types/PriceType'

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

  getList(ids: string[], ops: { sections?: string[] } = {}): Promise<Type[]> {
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
  async search(
    fields: string[] = [],
    value: string | number | boolean,
    avoidIds: string[]
  ) {
    const promises = fields.map((field) => {
      const number = parseFloat(value as string)
      //* search as number
      const filters = []
      if (avoidIds.length > 0)
        filters.push(where(documentId(), 'not-in', avoidIds.slice(0, 10)))

      if (field === 'folio')
        return this.findMany([...filters, where(field, '==', number)])
      //* search with phone format
      if (field === 'phone')
        return this.findMany([...filters, where(field, '==', `+52${value}`)])
      //* search as string
      return this.findMany([...filters, where(field, '==', value)])
    })
    return await Promise.all(promises).then((res) => res.flat())
  }

  async getRentItemsLocation(storeId: string) {
    return await this.findMany([
      where('storeId', '==', storeId),
      where('type', '==', TypeOrder.RENT),
      where('status', '==', order_status.DELIVERED)
    ])
  }

  async getUnsolvedByStore(
    storeId: string,
    {
      sections = [],
      getBySections = false,
      getExpireTomorrow = false,
      reports = []
    }: {
      sections: string[]
      getBySections: boolean
      reports: CommentType[]
      getExpireTomorrow?: boolean
    }
  ) {
    // const TODAY_ALL_DAY = new Date(new Date().setHours(23, 59, 59, 999))
    // const TOMORROW_ALL_DAY = addDays(TODAY_ALL_DAY, 1)
    const TODAY = new Date()
    const TOMORROW = addDays(new Date(), 1)
    const DAY_AFTER_TOMORROW = addDays(new Date(), 2)

    const filterRentPending = [
      where('type', '==', TypeOrder.RENT),
      where('status', 'in', [order_status.PENDING, order_status.AUTHORIZED])
    ]
    const filterRepairs = [
      where('type', '==', TypeOrder.REPAIR),
      where('status', 'in', [
        order_status.PENDING,
        order_status.AUTHORIZED,
        order_status.REPAIRING,
        order_status.REPAIRED,
        order_status.PICKED_UP
      ])
    ]
    const filterExpiredRents = [
      where('type', '==', TypeOrder.RENT),
      where('status', '==', order_status.DELIVERED)
      //* get orders that are expired today don't meter the hours
    ]

    //* SET FILTERS TO EXPIRE AT
    if (getExpireTomorrow) {
      filterExpiredRents.push(where('expireAt', '<=', DAY_AFTER_TOMORROW))
    } else {
      filterExpiredRents.push(where('expireAt', '<=', TOMORROW))
    }

    if (getBySections) {
      filterRentPending.push(where('assignToSection', 'in', sections))
      filterRepairs.push(where('assignToSection', 'in', sections))
      filterExpiredRents.push(where('assignToSection', 'in', sections))
    }
    const rentPending = await this.findMany([
      ...filterRentPending,
      where('storeId', '==', storeId)
    ])
    const expiredRents = await this.findMany([
      ...filterExpiredRents,
      where('storeId', '==', storeId)
    ])
    const repairs = await this.findMany([
      ...filterRepairs,
      where('storeId', '==', storeId)
    ])
    const unsolvedOrders = [...rentPending, ...repairs, ...expiredRents]

    //* *** 1 *** get reports and set the ids, to get reports from the database
    const ordersWithReportsIds = Array.from(
      new Set(
        reports
          .filter(({ type }) => type === 'report')
          .map(({ orderId }) => orderId)
      )
    )
    //* IF is getBySection just take the reported orders by sections
    let reportedOrders = await this.getList(ordersWithReportsIds, { sections })

    //*  *** 2 *** remove reported orders from unsolved orders
    const removeReportedFromUnsolved = unsolvedOrders.filter(
      ({ id }) =>
        !reportedOrders.find(({ id: reportedId }) => reportedId === id)
    )
    //*  *** 3 *** add reported orders to unsolved orders
    return [...removeReportedFromUnsolved, ...reportedOrders]
  }

  onExtend = async ({
    orderId,
    reason,
    time,
    startAt,
    items
  }: {
    orderId: string
    reason: ExtendReason
    time: PriceType['time']
    startAt: Date
    items: OrderType['items']
  }) => {
    const userId = auth.currentUser?.uid
    const uuid = createUUID()
    const expireAt = expireDate2({ startedAt: startAt, price: { time } })
    return await this.update(orderId, {
      items, //* <--- modify the new order items
      expireAt, //* <--- modify the new order expire date
      [`extensions.${uuid}`]: {
        id: uuid,
        time,
        reason,
        startAt,
        expireAt,
        createdAt: new Date(),
        createdBy: userId
      }
    })
  }
  async customMethod() {
    // Implementa tu método personalizado
  }
}

export type ExtendReason = 'renew' | 'report' | 'original'

export const ServiceOrders = new ServiceOrdersClass()
