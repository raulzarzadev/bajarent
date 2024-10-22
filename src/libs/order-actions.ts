import { arrayRemove, arrayUnion } from 'firebase/firestore'
import { handleSetStatuses } from '../components/OrderActions/libs/update_statuses'
import {
  onPickUpItem,
  onRegistryEntry,
  onRentItem
} from '../firebase/actions/item-actions'
import { ExtendReason, ServiceOrders } from '../firebase/ServiceOrders'
import { ServicePayments } from '../firebase/ServicePayments'
import { CommentType } from '../types/CommentType'
import OrderType, {
  ContactType,
  order_status,
  order_type,
  OrderQuoteType
} from '../types/OrderType'
import PaymentType from '../types/PaymentType'
import { PriceType, TimePriceType } from '../types/PriceType'
import StoreType from '../types/StoreType'
import { orderExpireAt } from './orders'
import { createUUID } from './createId'

export const onComment = async ({
  orderId,
  storeId,
  content,
  type,
  isOrderMovement = false,
  variant = 'regular_comment'
}: {
  orderId: string
  storeId: string
  content: string
  type: CommentType['type']
  isOrderMovement?: boolean
  variant?: CommentType['variant']
}) => {
  return await ServiceOrders.addComment({
    storeId,
    orderId,
    type,
    content,
    isOrderMovement,
    variant
  })
    .then(() => {
      console.log('comment')
    })
    .catch(console.error)
}

export const onAuthorize = async ({
  orderId,
  userId,
  storeId,
  repairCanceled
}: {
  orderId: string
  userId: string
  storeId: string
  repairCanceled?: boolean
}) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.AUTHORIZED,
    authorizedAt: new Date(),
    authorizedBy: userId,
    workshopFlow: {
      pendingAt: new Date()
    },
    workshopStatus: 'pending'
  })
    .then((res) => {
      onComment({
        orderId,
        storeId,
        content: repairCanceled ? 'Marcada como pedido' : 'Autorizada',
        type: 'comment',
        isOrderMovement: true
      })
      console.log('authorize')
    })
    .catch(console.error)
}

export const onDelivery = async ({
  orderId,
  userId,
  expireAt,
  items,
  order,
  deliveredAt = new Date() // default to now, optional you can delivery in the past
}: {
  orderId: string
  userId: string
  expireAt: Date
  items: OrderType['items']
  order?: Partial<OrderType>
  deliveredAt?: Date
}) => {
  return await ServiceOrders.update(orderId, {
    ...order,
    expireAt,
    status: order_status.DELIVERED,
    deliveredAt,
    deliveredBy: userId,
    isDelivered: true,
    items
  })
    .then(() => {
      console.log('delivery')
    })
    .catch(console.error)
}

export const onRentPickup = async ({ orderId, userId, storeId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.PICKED_UP,
    pickedUpAt: new Date(),
    pickedUpBy: userId,
    isDelivered: false
    // workshopStatus: 'pickedUp'
  })
    .then(() => {
      onComment({
        orderId: orderId,
        content: 'Recogida',
        storeId,
        type: 'comment'
      })
      console.log('pickup')
    })
    .catch(console.error)
}
export const onRepairPickup = async ({ orderId, userId, storeId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.PICKED_UP,
    repairPickedUpAt: new Date(),
    repairPickedUpBy: userId,
    isRepairPickedUp: true,
    workshopStatus: 'pickedUp',
    'workshopFlow.pickedUpAt': new Date()
  })
    .then(() => {
      onComment({
        orderId: orderId,
        content: 'Recogida',
        storeId,
        type: 'comment',
        variant: 'workshop_flow'
      })
      console.log('repair pickup')
    })
    .catch(console.error)
}

export const onRepairStart = async ({
  orderId,
  userId,
  comment
}: {
  orderId: string
  userId: string
  comment?: string
}) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.REPAIRING,
    repairingAt: new Date(),
    repairingBy: userId,
    isRepairing: true,
    workshopStatus: 'started',
    repairInfo: comment || ''
  })
    .then(() => {
      onComment({
        orderId,
        content: 'Reparacion iniciada',
        type: 'comment',
        storeId: orderId,
        isOrderMovement: true,
        variant: 'workshop_flow'
      })
      console.log('repairing')
    })
    .catch(console.error)
}

export const onRepairFinish = async ({ orderId, userId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.REPAIRED,
    repairedAt: new Date(),
    repairedBy: userId,
    isRepairing: false,
    workshopStatus: 'finished',
    'workshopFlow.finishedAt': new Date()
  })
    .then(() => {
      onComment({
        orderId,
        content: 'Reparacion terminada',
        type: 'comment',
        storeId: orderId,
        isOrderMovement: true,
        variant: 'workshop_flow'
      })
    })
    .catch(console.error)
}
export const onRepairCancelPickup = async ({ orderId, userId, storeId }) => {
  onAuthorize({ orderId, userId, storeId, repairCanceled: true })
}
export const onRepairDelivery = async ({ orderId, userId, storeId }) => {
  if (!userId) return console.error('no userId')
  return await ServiceOrders.update(orderId, {
    status: order_status.DELIVERED,
    deliveredAt: new Date(),
    deliveredBy: userId,
    isDelivered: true,
    workshopStatus: 'delivered'
  })
    .then(() => {
      onComment({
        content: 'Reparacion entregada',
        orderId,
        type: 'comment',
        variant: 'workshop_flow',
        storeId
      }).catch(console.error)
    })
    .catch(console.error)
}

export const onRenew = async ({ orderId, renewedTo = '', userId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.RENEWED,
    renewedAt: new Date(),
    renewedBy: userId,
    renewedTo,
    isRenewed: true
  })
    .then(console.log)
    .catch(console.error)
}
export const onCancel = async ({
  orderId,
  userId,
  cancelledReason = '',
  storeId
}) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.CANCELLED,
    cancelledAt: new Date(),
    cancelledBy: userId,
    isCancelled: true,
    cancelledReason
  })
    .then(() => {
      onComment({
        content: `Cancelada. ${cancelledReason}`,
        storeId,
        orderId,
        type: 'comment'
      })
      console.log('cancel')
    })
    .catch(console.error)
}

export const onDelete = async ({ orderId }) => {
  //? should be a soft delete isDeleted: true
  return await ServiceOrders.delete(orderId)
    .then(() => {
      console.log('delete')
    })
    .catch(console.error)
}

export const onPending = async ({ orderId }) => {
  return await ServiceOrders.update(orderId, {
    status: order_status.PENDING
  })
    .then(() => {
      console.log('pending')
    })
    .catch(console.error)
}

export const onExtend = async (
  orderId: string,
  { time, reason }: { time: TimePriceType; reason: string }
) => {
  return await ServiceOrders.update(orderId, {
    extendTime: time,
    extendReason: reason,
    isExtended: true
  })
    .then(() => {})
    .catch(console.error)
}

export const onExtend_V2 = async ({
  orderId,
  time,
  reason,
  startAt,
  items,
  content
}: {
  orderId: string
  time: TimePriceType
  reason: ExtendReason
  startAt: Date
  items: OrderType['items']
  content?: string
}) => {
  //********* Add the original order to extends list if it does't have  extensions
  const order = await ServiceOrders.get(orderId)
  if (!order?.extensions) {
    await ServiceOrders.onExtend({
      items: order.items,
      orderId: order.id,
      startAt: order.deliveredAt,
      time: order.items[0].priceSelected.time,
      reason: 'original'
    })
  }

  return await ServiceOrders.onExtend({
    orderId,
    time,
    reason,
    startAt,
    items,
    content
  })
}

export const onPay = async ({
  orderId,
  payment,
  storeId
}: {
  orderId: OrderType['id']
  storeId: StoreType['id']
  payment: PaymentType
}) => {
  return await ServicePayments.orderPayment({ orderId, storeId, ...payment })
}

export const onSetStatuses = async ({ orderId }) => {
  const order = await ServiceOrders.get(orderId)
  const { order: newOrder } = handleSetStatuses({ order })
  return await ServiceOrders.update(orderId, { ...newOrder, statuses: true })
}

export const onRentFinish = async ({
  order,
  userId
}: {
  order: Partial<OrderType>
  userId: string
}) => {
  const items = order?.items || []
  const storeId = order.storeId
  const orderId = order?.id

  if (order.type != order_type.RENT)
    return console.error('Order is not a rent order')
  try {
    const promises = items?.map(async (item) => {
      return onPickUpItem({
        storeId,
        itemId: item.id,
        orderId: order.id,
        assignToSection: order?.assignToSection || ''
      })
        .then(async (res) => {
          // console.log({ res }, 'item picked up', item?.id, item?.number)
        })
        .catch(console.error)
    })

    await Promise.all(promises)
      .then((res) => {
        //  console.log({ res })
      })
      .catch(console.error)

    //* pickup order
    await onRentPickup({ orderId, userId, storeId })
  } catch (error) {
    console.error(error)
  }

  //*pickup items
}
export const onRentStart = async ({
  order,
  userId,
  deliveredAt = new Date()
}: {
  order: Partial<OrderType>
  userId: string
  deliveredAt?: Date
}) => {
  const items = order?.items || []
  const storeId = order.storeId
  const orderId = order?.id

  if (order.type != order_type.RENT)
    return console.error('Order is not a rent order')

  const expireAt = orderExpireAt({
    order: { ...order, deliveredAt: deliveredAt }
  })
  //* delivery order
  onDelivery({
    expireAt,
    orderId,
    userId,
    items,
    order,
    deliveredAt
  })
    .then((r) => console.log(r))
    .catch((e) => console.error(e))

  //* create movement
  await onComment({
    orderId,
    storeId,
    content: 'Entregada',
    type: 'comment'
  })
    .then((r) => console.log(r))
    .catch((e) => console.error(e))

  //* delivery items
  const rentOrderPromises = items.map((item) => {
    return onRentItem({
      itemId: item.id,
      storeId: storeId,
      orderId
    })
  })
  const registryItemsEntriesPromises = items.map((item) => {
    return onRegistryEntry({
      storeId,
      itemId: item.id,
      type: 'delivery',
      orderId
    })
      .then((res) => console.log({ res }))
      .catch((err) => console.error({ err }))
  })

  await Promise.all(rentOrderPromises)
    .then((r) => console.log(r))
    .catch((e) => console.error(e))

  await Promise.all(registryItemsEntriesPromises)
    .then((r) => console.log(r))
    .catch((e) => console.error(e))
}

export const onAddQuote = async ({
  newQuote,
  orderId
}: {
  newQuote: OrderQuoteType
  orderId: OrderType['id']
}) => {
  const quiteId = createUUID()
  return ServiceOrders.update(orderId, {
    quotes: arrayUnion({ ...newQuote, id: quiteId })
  })
}

export const onAddContact = async ({
  contact,
  orderId
}: {
  contact: ContactType
  orderId: OrderType['id']
}) => {
  const quiteId = createUUID()
  return ServiceOrders.update(orderId, {
    contacts: arrayUnion({ ...contact, id: quiteId })
  })
}

export const onRemoveContact = async ({
  contact,
  orderId
}: {
  contact: ContactType
  orderId: OrderType['id']
}) => {
  return ServiceOrders.update(orderId, {
    contacts: arrayRemove(contact)
  })
}

export const onMarkContactAsFavorite = async ({
  contact,
  orderId,
  isFavorite
}: {
  contact: ContactType
  orderId: OrderType['id']
  isFavorite: boolean
}) => {
  onRemoveContact({ contact, orderId })
  return ServiceOrders.update(orderId, {
    contacts: arrayUnion({ ...contact, isFavorite })
  })
}

export const onAssignOrder = async ({
  orderId,
  sectionId,
  sectionName,
  storeId,
  fromSectionName
}: {
  orderId: OrderType['id']
  sectionId: string
  sectionName: string
  storeId: StoreType['id']
  fromSectionName?: string
}) => {
  const res = await ServiceOrders.update(orderId, {
    assignToSection: sectionId,
    assignToSectionName: sectionName
  })
  onComment({
    orderId,
    content: `Asignada${
      !!fromSectionName ? ` de ${fromSectionName}` : ''
    } a ${sectionName}`,
    type: 'comment',
    storeId,
    isOrderMovement: true
  })
  return res
}

export const onChangeOrderItemTime = async ({
  orderId,
  itemId,
  priceSelected
}: {
  orderId: OrderType['id']
  itemId: string
  priceSelected: Partial<PriceType>
}) => {
  return ServiceOrders.updateItemPrice({
    orderId,
    itemId,
    newPrice: priceSelected
  })
}
//#region ORDER QUOTES

export const onEditQuote = async ({
  oldQuote,
  newQuoteProps,
  orderId
}: {
  oldQuote: OrderQuoteType
  newQuoteProps: OrderQuoteType
  orderId: OrderType['id']
}) => {
  await onRemoveQuote({ quote: oldQuote, orderId })
  return ServiceOrders.update(orderId, {
    quotes: arrayUnion({ quote: { ...oldQuote, ...newQuoteProps } })
  })
}
export const onMarkQuoteAsDone = async ({
  quoteId,
  orderId
}: {
  quoteId: OrderQuoteType['id']
  orderId: OrderType['id']
}) => {
  try {
    const quotes = (await ServiceOrders.get(orderId).then((res) => {
      return res?.quotes
    })) as OrderQuoteType[]

    const newQuotes: OrderQuoteType[] = quotes.map((quote) => {
      if (quote.id === quoteId) {
        return { ...quote, doneAt: !!quote.doneAt ? null : new Date() }
      }
      return quote
    })

    return ServiceOrders.update(orderId, {
      quotes: newQuotes
    })

    // if (!quote) return console.error('Quote not found')
    // await onRemoveQuote({ quote, orderId })
    // return ServiceOrders.update(orderId, {
    //   quotes: arrayUnion({
    //     ...quote,
    //     doneAt: !!quote.doneAt ? null : new Date()
    //   })
    // })
  } catch (error) {
    console.log(error)
  }
}

export const onRemoveQuote = async ({
  quote,
  orderId
}: {
  quote: OrderQuoteType
  orderId: OrderType['id']
}) => {
  return ServiceOrders.update(orderId, {
    quotes: arrayRemove(quote)
  })
}
