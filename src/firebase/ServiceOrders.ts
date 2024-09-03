import { documentId, where } from 'firebase/firestore'
import OrderType, {
  ORDER_STATUS_SOLVED,
  ORDER_STATUS_UNSOLVED,
  OrderExtensionType,
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
import ItemType from '../types/ItemType'
import { GetItemsOps } from './firebase.CRUD'

type Type = OrderType

class ServiceOrdersClass extends FirebaseGenericService<Type> {
  constructor() {
    super('orders')
  }

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
    content,
    isOrderMovement = false
  }: {
    storeId: string
    orderId: string
    type: CommentType['type']
    content: string
    isOrderMovement?: boolean
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
      solved: false,
      isOrderMovement
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
    return await this.findMany([
      where('storeId', '==', storeId)
      // where('type', '==', order_type.RENT)
    ])
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
    // if(ids.length>30) return Promise.reject('Max 30 ids')
    if (ids.length > 30) {
      const promises = [] //FIXME: this is hotfix im not sure if is the best way to do it
      for (let i = 0; i < ids.length; i += 30) {
        const chunk = ids.slice(i, i + 30)
        promises.push(this.getList(chunk, ops))
      }
      return Promise.all(promises).then((res) => res.flat())
    } else {
      const filters = [where(documentId(), 'in', ids)]
      if (sections?.length > 0)
        filters.push(where('assignToSection', 'in', sections))

      return this.findMany(filters)
    }
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
    return orders?.map((order) => ({
      ...order,
      comments: reportsNotSolved.filter(({ orderId }) => orderId === order.id)
    }))
  }

  // export type CollectionSearch = {
  //   collectionName: string
  //   fields: string[]
  //   assignedSections?: 'all' | string[]
  // }
  async search({
    storeId,
    fields,
    value,
    avoidIds,
    sections
  }: {
    storeId: string
    fields: string[]
    value: string | number
    avoidIds?: string[]
    sections: string[] | 'all' //FIXME: if is undefined, search in all sections, if is an array search in the array
  }): Promise<Partial<Type>[] | void> {
    const promises = fields?.map((field) => {
      const number = parseFloat(value as string)
      //* search as number
      const filters = [where('storeId', '==', storeId)]
      if (Array.isArray(sections) && sections.length > 0) {
        filters.push(where('assignToSection', 'in', sections))
      }

      if (field === 'folio')
        return this.findMany([...filters, where(field, '==', number)])
      //* search with phone format
      if (field === 'phone')
        return this.findMany([...filters, where(field, '==', `+52${value}`)])
      //* search as string
      return this.findMany([...filters, where(field, '==', value)])
    })
    return await Promise.all(promises)
      .then((res) => res.flat())
      .catch((e) => console.log({ e }))
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
    // To work properly this should find in all day and tomorrow all day new Date(new Date().setHours(23, 59, 59, 999))
    const TODAY = new Date(new Date().setHours(23, 59, 59, 999))
    const TOMORROW = addDays(TODAY, 1)
    const DAY_AFTER_TOMORROW = addDays(TODAY, 2)

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
      filterExpiredRents.push(where('expireAt', '<=', TOMORROW))
    } else {
      filterExpiredRents.push(where('expireAt', '<=', TODAY))
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
          ?.filter(({ type }) => type === 'report' || type === 'important')
          ?.map(({ orderId }) => orderId)
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
    items,
    content = null
  }: {
    orderId: string
    reason: ExtendReason
    time: PriceType['time']
    startAt: Date
    items: OrderType['items']
    content?: string
  }) => {
    const userId = auth.currentUser?.uid
    const uuid = createUUID()
    const expireAt = expireDate2({ startedAt: startAt, price: { time } })
    const isRenew = reason === 'renew'
    const newExtension: OrderExtensionType = {
      id: uuid,
      time,
      reason,
      startAt,
      expireAt,
      createdAt: new Date(),
      createdBy: userId,
      content
    }

    const orderUpdated: Partial<OrderType> = {
      items, //* <--- modify the new order items
      expireAt, //* <--- modify the new order expire date

      [`extensions.${uuid}`]: newExtension
    }

    if (isRenew) {
      orderUpdated.renewedAt = new Date()
      orderUpdated.renewedBy = userId
    }

    return await this.update(orderId, { ...orderUpdated })
  }
  async getClientOrders({ clientId, storeId }, ops?: { justIds: boolean }) {
    const justIds = !!ops?.justIds
    if (justIds)
      return this.findMany(
        [where('clientId', '==', clientId), where('storeId', '==', storeId)],
        { justRefs: true }
      ).then((res) => res?.map(({ id }) => id))
    return this.findMany([
      where('clientId', '==', clientId),
      where('storeId', '==', storeId)
    ])
  }
  async customMethod() {
    // Implementa tu método personalizado
  }

  async updateItemId({
    orderId,
    itemId,
    newItemId,
    newItemCategoryName = '',
    newItemNumber = ''
  }: {
    orderId: string
    itemId: string
    newItemId: string
    newItemCategoryName: string
    newItemNumber: ItemType['number']
  }) {
    const items = await this.get(orderId).then((res) => res.items)
    const itemIndex = items.findIndex((item) => item.id === itemId)
    if (itemIndex < 0) return console.error('Item not found')
    items[itemIndex].id = newItemId
    items[itemIndex].categoryName = newItemCategoryName
    items[itemIndex].number = newItemNumber || ''
    return await this.update(orderId, { items })
  }

  async updateOrderItemId({ orderId, oldItemId, newItemId }) {
    const order = await this.get(orderId)
    const items = order?.items?.map((item) => {
      if (item.id === oldItemId) {
        item.id = newItemId
      }
      return item
    })
    return await this.update(orderId, { items })
  }

  async updateItemPrice({
    orderId,
    itemId,
    newPrice
  }: {
    orderId: string
    itemId: string
    newPrice: Partial<PriceType>
  }) {
    const items = await this.get(orderId).then((res) => res.items)
    const itemIndex = items.findIndex((item) => item.id === itemId)
    if (itemIndex < 0) return console.error('Item not found')
    items[itemIndex].priceSelected = newPrice
    items[itemIndex].priceSelectedId = newPrice.id
    return await this.update(orderId, { items })
  }

  static createFilterToGetOrderFieldValue = ({
    status,
    field,
    storeId,
    userId,
    fromDate,
    toDate
  }: {
    status: OrderType['status']
    storeId: string
    field: keyof OrderType
    userId: string
    fromDate: Date
    toDate: Date
  }) => {
    const filters = [
      where('storeId', '==', storeId),
      where('status', '==', status)
    ]
    //* Replace last to words of fields by ""By"

    const formatField = field.replace(/At/g, 'By')
    if (userId) filters.push(where(formatField, '==', userId))
    if (fromDate) filters.push(where(field, '>=', fromDate))
    if (toDate) filters.push(where(field, '<=', toDate))
    return filters
  }

  async getDelivered(
    {
      storeId,
      userId,
      fromDate,
      toDate
    }: {
      storeId: string
      userId: string
      fromDate: Date
      toDate: Date
    },
    ops?: GetItemsOps
  ) {
    const filters = ServiceOrdersClass.createFilterToGetOrderFieldValue({
      status: order_status.DELIVERED,
      storeId,
      userId,
      fromDate,
      toDate,
      field: 'deliveredAt'
    })

    return this.findMany(filters, ops)
  }

  async getRenewed(
    {
      storeId,
      userId,
      fromDate,
      toDate
    }: {
      storeId: string
      userId: string
      fromDate: Date
      toDate: Date
    },
    ops?: GetItemsOps
  ) {
    const filters = ServiceOrdersClass.createFilterToGetOrderFieldValue({
      status: order_status.DELIVERED,
      storeId,
      userId,
      fromDate,
      toDate,
      field: 'renewedAt'
    })

    return this.findMany(filters, ops)
  }
  async getPickedUp(
    {
      storeId,
      userId,
      fromDate,
      toDate
    }: {
      storeId: string
      userId: string
      fromDate: Date
      toDate: Date
    },
    ops?: GetItemsOps
  ) {
    const filters = ServiceOrdersClass.createFilterToGetOrderFieldValue({
      status: order_status.PICKED_UP,
      storeId,
      userId,
      fromDate,
      toDate,
      field: 'pickedUpAt'
    })

    return this.findMany(filters, ops)
  }
  getFieldBetweenDates = async (
    {
      storeId,
      field,
      fromDate,
      toDate
    }: {
      storeId: string
      field: keyof OrderType
      fromDate: Date
      toDate: Date
    },
    ops?: GetItemsOps
  ) => {
    const filters = [
      where('storeId', '==', storeId),
      where(field, '>=', fromDate),
      where(field, '<=', toDate)
    ]
    return this.findMany(filters, ops)
  }
}

export type ExtendReason = 'renew' | 'report' | 'original' | 'extension'

export const ServiceOrders = new ServiceOrdersClass()
