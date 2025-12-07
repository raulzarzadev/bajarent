import { FieldValue, Timestamp } from 'firebase/firestore'
import BaseType from '../../types/BaseType'
import { PlaneDateType } from '../../libs/utils-date'

export type CurrentWorkBase = {
	storeId: string
	date: Timestamp | Date
	planeDate: PlaneDateType
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
	sectionId?: string
}

export type NewWorkUpdate = Pick<CurrentWorkUpdate, 'type' | 'action' | 'details'>

export type CurrentWorkType = CurrentWorkBase & BaseType
export type WorkActions = keyof typeof WORK_ACTIONS
export const orders_work_actions = {
	reorder: 'Reordenar',
	created: 'Creada',

	repair_delivered: 'Reparación entregada',
	repair_authorized: 'Reparación autorizada',
	repair_start: 'Reparación comenzada',
	repair_finish: 'Reparación terminada',
	repair_pickup_canceled: 'repair_pickup_canceled',

	rent_authorized: 'Renta autorizada',
	rent_canceled: 'Renta cancelada',
	rent_renewed: 'Renta renovada',
	rent_delivered: 'Renta entregada',
	rent_picked_up: 'Renta recogida',
	rent_picked_up_canceled: 'Renta recogida cancelada',
	rent_delivered_canceled: 'Renta entregada cancelada',
	rent_extended: 'Renta extendida',

	order_delivered: 'Orden entregada',
	order_picked_up: 'Orden recogida',
	order_renewed: 'Orden renovada',
	order_canceled: 'Orden cancelada',
	order_authorized: 'Orden autorizada',
	order_created: 'Orden creada',
	order_updated: 'Orden actualizada',
	order_deleted: 'Orden eliminada',
	order_reassigned: 'Orden reasignada'
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
