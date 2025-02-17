import { FieldValue, Timestamp } from 'firebase/firestore'
import BaseType from '../../types/BaseType'

export type CurrentWorkBase = {
  storeId: string
  date: Timestamp | Date
  updates: {
    [updateId: string]: CurrentWorkUpdate
  }
}

export type CurrentWorkUpdate = {
  type: 'order' | 'item' | 'payment'
  action: WorkActions
  details?: CurrentWorkUpdateDetails
  createdAt: Timestamp | Date | FieldValue
  createdBy: string
  id: string
}
export type CurrentWorkUpdateDetails = {
  orderId?: string
  itemId?: string
  paymentId?: string
}

export type NewWorkUpdate = Pick<
  CurrentWorkUpdate,
  'type' | 'action' | 'details'
>

export type CurrentWorkType = CurrentWorkBase & BaseType
export type WorkActions = keyof typeof WORK_ACTIONS
export const orders_work_actions = {
  repair_delivered: 'Reparación entregada',
  repair_authorized: 'Reparación autorizada',
  repair_start: 'Reparación comenzada',
  repair_finish: 'Reparación terminada',
  repair_pickup_canceled: 'repair_pickup_canceled',
  order_delivered: 'Orden entregada',
  order_picked_up: 'Orden recogida',
  order_renewed: 'Orden renovada',
  order_canceled: 'Orden cancelada',
  order_authorized: 'Orden autorizada',
  order_created: 'Orden creada',
  order_updated: 'Orden actualizada',
  order_deleted: 'Orden eliminada'
}
export const items_work_actions = {
  item_repaired: 'Artículo reparado',
  item_renewed: 'Artículo renovado',
  item_canceled: 'Artículo cancelado',
  item_created: 'Artículo creado',
  item_updated: 'Artículo actualizado',
  item_deleted: 'Artículo eliminado'
}

export const payment_work_actions = {
  payment_created: 'Pago creado',
  payment_updated: 'Pago actualizado',
  payment_deleted: 'Pago eliminado'
}
export const WORK_ACTIONS = {
  ...orders_work_actions,
  ...items_work_actions,
  ...payment_work_actions
} as const
