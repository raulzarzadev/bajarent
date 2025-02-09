import {
  documentId,
  increment,
  QueryFieldFilterConstraint,
  where
} from 'firebase/firestore'
import OrderType, {
  ORDER_STATUS_SOLVED,
  ORDER_STATUS_UNSOLVED,
  OrderExtensionType,
  TypeOrder,
  TypeOrderType,
  order_status,
  order_type
} from '../types/OrderType'
import { FirebaseGenericService } from './genericService'

import { ServiceComments } from './ServiceComments'
import { CommentType, CreateCommentType } from '../types/CommentType'
import { ServiceStores } from './ServiceStore'
import { addDays, isSaturday, isValid } from 'date-fns'
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
   * @param order OrderType
   * @returns orderId or null in case of error
   */
  async createSerialOrder(order: Type): Promise<string> | null {
    if (!order.storeId) console.error('No storeId provided')
    try {
      // FIRST update store
      await ServiceStores.update(order.storeId, {
        currentFolio: increment(1)
      })
      // SECOND create order
      const currentFolio = (await ServiceStores.get(order.storeId)).currentFolio
      order.folio = currentFolio as unknown as number
      const orderId = await super.create(order).then((res) => res.res.id)
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
    isOrderMovement = false,
    variant = 'regular_comment'
  }: {
    storeId: string
    orderId: string
    type: CommentType['type']
    content: string
    isOrderMovement?: boolean
    variant?: CommentType['variant']
  }) {
    if (!orderId) return console.error('No orderId provided')
    if (!storeId) return console.error('No storeId provided')
    if (!type) type = 'comment'
    if (!content) content = ''

    const comment: Partial<CreateCommentType> = {
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
   * @deprecated
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

  async getByStore(storeId: string, ops?: GetItemsOps) {
    return await this.findMany(
      [
        where('storeId', '==', storeId)
        // where('type', '==', order_type.RENT)
      ],
      ops
    )
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

  getList(
    ids: string[],
    ops: GetItemsOps & { sections?: string[] } = {}
  ): Promise<Type[]> {
    const maxAllowedIds =
      ops.sections && ops.sections.length > 0
        ? Math.floor(30 / ops.sections.length)
        : 30

    if (ids.length <= maxAllowedIds) {
      // Lógica para cuando hay maxAllowedIds o menos ids
      const filters = [where(documentId(), 'in', ids)]
      if (ops.sections?.length) {
        filters.push(where('assignToSection', 'in', ops.sections))
      }
      return this.findMany(filters)
    } else {
      // Cuando hay más de 30 ids, divídelo en chunks y utiliza recursión
      const promises: Promise<Type[]>[] = []
      for (let i = 0; i < ids.length; i += maxAllowedIds) {
        const chunk = ids.slice(i, i + maxAllowedIds)
        promises.push(this.getList(chunk, ops))
      }
      return Promise.all(promises)
        .then((res) => res.flat())
        .catch((e) => {
          console.error(e)
          return []
        })
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
    const promises = fields
      ?.map((field) => {
        const asNumber = Number(value)
        const itsValidNumber = !isNaN(asNumber)
        //* search as number
        const filters = [where('storeId', '==', storeId)]
        if (Array.isArray(sections) && sections.length > 0) {
          filters.push(where('assignToSection', 'in', sections))
        }
        if (field === 'folio') {
          return itsValidNumber //* <--- just search if is a number
            ? this.findMany([...filters, where(field, '==', asNumber)])
            : null
        }
        //* search with phone format
        if (field === 'phone') {
          return itsValidNumber && String(value).length === 10 //* <--- just search if is a number
            ? this.findMany([...filters, where(field, '==', `+52${asNumber}`)])
            : null
        }
        //* search as string
        return this.findMany([...filters, where(field, '==', value)])
      })
      //* remove unset promises
      .filter((a) => a !== null)
    return await Promise.all(promises)
      .then((res) => res.flat())
      .catch((e) => console.log({ e }))
  }

  async getRentItemsLocation(storeId: string) {
    return await this.findMany([
      where('storeId', '==', storeId),
      where('type', '==', order_type.RENT),
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
    },
    ops?: GetItemsOps
  ) {
    const TODAY = new Date(new Date().setHours(23, 59, 59, 999))

    const TOMORROW = isSaturday(TODAY) // get orders on sunday to expire on monday because is the next working day
      ? addDays(TODAY, 2)
      : addDays(TODAY, 1)

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
    const filterSalesPending = [
      where('type', '==', order_type.SALE),
      where('status', 'in', [order_status.AUTHORIZED])
    ]

    //* SET FILTERS TO EXPIRE AT
    if (getExpireTomorrow) {
      filterExpiredRents.push(where('expireAt', '<=', TOMORROW))
    } else {
      filterExpiredRents.push(where('expireAt', '<=', TODAY))
    }

    if (getBySections) {
      if (sections.length === 0) {
        console.log('sections is empty', sections)
      } else {
        filterRentPending.push(where('assignToSection', 'in', sections))
        filterRepairs.push(where('assignToSection', 'in', sections))
        filterExpiredRents.push(where('assignToSection', 'in', sections))
        filterSalesPending.push(where('assignToSection', 'in', sections))
      }
    }
    const rentPending = await this.findMany(
      [...filterRentPending, where('storeId', '==', storeId)],
      ops
    ).catch((e) => {
      console.log('Error getting reported orders', e)
      return []
    })
    const expiredRents = await this.findMany(
      [...filterExpiredRents, where('storeId', '==', storeId)],
      ops
    ).catch((e) => {
      console.log('Error getting reported orders', e)
      return []
    })
    const repairs = await this.findMany(
      [...filterRepairs, where('storeId', '==', storeId)],
      ops
    ).catch((e) => {
      console.log('Error getting reported orders', e)
      return []
    })

    const sales = await this.findMany(
      [...filterSalesPending, where('storeId', '==', storeId)],
      ops
    ).catch((e) => {
      console.log('Error getting reported orders', e)
      return []
    })
    const unsolvedOrders = [
      ...rentPending,
      ...repairs,
      ...expiredRents,
      ...sales
    ]

    //* *** 1 *** get reports and set the ids, to get reports from the database
    const ordersWithReportsAndImportantUnsolved = Array.from(
      new Set(
        reports
          ?.filter(
            ({ type, solved }) =>
              (type === 'report' || type === 'important') && solved === false
          )
          ?.map(({ orderId }) => orderId)
      )
    )
    //* IF is getBySection just take the reported orders by sections
    let reportedOrders = []
    //* if ordersWithReportsAndImportantUnsolved dont get list
    if (ordersWithReportsAndImportantUnsolved.length > 0) {
      const res = await this.getList(ordersWithReportsAndImportantUnsolved, {
        sections,
        ...(ops || {})
      }).catch((e) => {
        console.log('Error getting reported orders', e)
        return []
      })
      if (res) {
        reportedOrders = res
      } else {
        console.log(
          'no ordersWithReportsAndImportantUnsolved in reported orders'
        )
      }
    }

    //*  *** 2 *** remove reported orders from unsolved orders
    const removeReportedFromUnsolved = unsolvedOrders.filter(
      ({ id }) =>
        !reportedOrders?.find(({ id: reportedId }) => reportedId === id)
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
      )
        .then((res) => res?.map(({ id }) => id))
        .catch((e) => {
          console.log('Error getting reported orders', e)
          return []
        })
    return this.findMany([
      where('clientId', '==', clientId),
      where('storeId', '==', storeId)
    ]).catch((e) => {
      console.log('Error getting reported orders', e)
      return []
    })
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
    toDate,
    sections,
    type
  }: {
    status: OrderType['status']
    storeId: string
    field: keyof OrderType
    userId: string
    fromDate: Date
    toDate: Date
    sections?: string[]
    type?: TypeOrderType
  }) => {
    const filters = [
      where('storeId', '==', storeId),
      where('status', '==', status)
    ]
    //* Replace last to words of fields by ""By"
    const fieldString = String(field)
    const formatField = fieldString.replace(/At/g, 'By')
    if (userId) filters.push(where(formatField, '==', userId))
    if (fromDate) filters.push(where(fieldString, '>=', fromDate))
    if (toDate) filters.push(where(fieldString, '<=', toDate))
    if (type) {
      filters.push(where('type', '==', type))
    }

    if (Array.isArray(sections) && sections.length > 0) {
      filters.push(where('assignToSection', 'in', sections))
    }

    return filters
  }

  async getDelivered(
    {
      storeId,
      userId,
      fromDate,
      sections,
      toDate,
      orderType
    }: {
      storeId: string
      userId?: string
      sections?: string[]
      fromDate: Date
      toDate: Date
      orderType?: TypeOrderType
    },
    ops?: GetItemsOps
  ): Promise<OrderType[]> {
    const filters = ServiceOrdersClass.createFilterToGetOrderFieldValue({
      status: order_status.DELIVERED,
      storeId,
      userId,
      fromDate,
      toDate,
      sections,
      field: 'deliveredAt',
      type: orderType
    })

    return this.findMany(filters, ops)
  }

  async getRenewed(
    {
      storeId,
      userId,
      fromDate,
      sections,
      toDate,
      orderType
    }: {
      storeId: string
      userId?: string
      fromDate: Date
      toDate: Date
      sections?: string[]
      orderType?: TypeOrderType
    },
    ops?: GetItemsOps
  ): Promise<OrderType[]> {
    const filters = ServiceOrdersClass.createFilterToGetOrderFieldValue({
      status: order_status.DELIVERED,
      storeId,
      userId,
      fromDate,
      toDate,
      sections,
      field: 'renewedAt',
      type: orderType
    })

    return this.findMany(filters, ops)
  }
  async getPickedUp(
    {
      storeId,
      userId,
      fromDate,
      toDate,
      sections,
      orderType
    }: {
      storeId: string
      userId?: string
      fromDate: Date
      toDate: Date
      sections?: string[]
      orderType?: TypeOrderType
    },
    ops?: GetItemsOps
  ): Promise<OrderType[]> {
    const filters = ServiceOrdersClass.createFilterToGetOrderFieldValue({
      status: order_status.PICKED_UP,
      storeId,
      userId,
      fromDate,
      toDate,
      field: 'pickedUpAt',
      sections,
      type: orderType
    })

    return this.findMany(filters, ops)
  }
  getAuthorized = async (
    {
      storeId,
      sections,
      orderType
    }: {
      storeId: string
      sections?: string[]
      orderType?: TypeOrderType
    },
    ops?: GetItemsOps
  ): Promise<OrderType[]> => {
    let filters = [
      where('storeId', '==', storeId),
      where('status', '==', order_status.AUTHORIZED)
    ]

    if (orderType) {
      filters.push(where('type', '==', orderType))
    }

    if (Array.isArray(sections) && sections.length > 0) {
      filters.push(where('assignToSection', 'in', sections))
    }

    return this.findMany(filters, ops)
  }

  listenRepairUnsolved = async (
    { storeId, cb }: { storeId: string; cb: CallableFunction },
    ops?: GetItemsOps
  ) => {
    const filters = [
      where('storeId', '==', storeId),
      where('type', '==', order_type.REPAIR),
      where('status', 'in', [
        order_status.AUTHORIZED,
        order_status.PENDING,
        order_status.PICKED_UP,
        order_status.REPAIRING,
        order_status.REPAIRED
      ])
    ]
    return this.listenMany(filters, cb)
  }

  getFieldBetweenDates = async (
    {
      storeId,
      field,
      fromDate,
      toDate,
      moreFilters = []
    }: {
      storeId: string
      field: keyof OrderType
      fromDate: Date
      toDate: Date
      moreFilters?: QueryFieldFilterConstraint[]
    },
    ops?: GetItemsOps
  ): Promise<OrderType[]> => {
    const filters = [
      where('storeId', '==', storeId),
      where(field as string, '>=', fromDate),
      where(field as string, '<=', toDate)
    ]
    if (moreFilters.length > 0) {
      filters.push(...moreFilters)
    }
    return this.findMany(filters, ops)
  }

  getRepairOrdersFlow = async ({
    storeId,
    fromDate,
    toDate
  }): Promise<{
    created: OrderType[]
    cancelled: OrderType[]
    started: OrderType[]
    finished: OrderType[]
  }> => {
    const [created, cancelled, started, finished] = await Promise.all([
      //* <--- Get by created date
      this.getFieldBetweenDates({
        storeId,
        field: 'createdAt',
        fromDate,
        toDate,
        moreFilters: [where('type', '==', order_type.REPAIR)]
      }),
      //* <--- Get by cancelledAt date
      this.getFieldBetweenDates({
        storeId,
        field: 'cancelledAt',
        fromDate,
        toDate,
        moreFilters: [where('type', '==', order_type.REPAIR)]
      }),
      //* <--- Get by repairing date
      this.getFieldBetweenDates({
        storeId,
        field: 'workshopFlow.startedAt',
        fromDate,
        toDate,
        moreFilters: [where('type', '==', order_type.REPAIR)]
      }),
      //* <--- Get by finishedAt date
      this.getFieldBetweenDates({
        storeId,
        field: 'workshopFlow.finishedAt',
        fromDate,
        toDate,
        moreFilters: [where('type', '==', order_type.REPAIR)]
      })
    ])
    return {
      created,
      cancelled,
      started,
      finished
    }
  }
}

export type ExtendReason = 'renew' | 'report' | 'original' | 'extension'

export const ServiceOrders = new ServiceOrdersClass()
