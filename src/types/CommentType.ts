import { ItemHistoryVariantType } from '../firebase/ServiceItemHistory'
import BaseType from './BaseType'
import { order_type } from './OrderType'

export enum comment_types {
	report = 'report',
	comment = 'comment',
	payment = 'payment',
	important = 'important',
	'item-movement' = 'item-movement'
}
export type CommentTypes = keyof typeof comment_types

export type CommentBase = {
	id: string

	orderId: string | null
	storeId: string

	type: CommentTypes
	status?: 'open' | 'close' | 'hidden'
	content: string

	solved?: boolean
	solvedAt?: Date
	solvedBy?: string

	itemId?: string
	solvedComment?: string
	variant?: CommentVariantType
	isReport?: boolean
	isImportant?: boolean
	isPayment?: boolean
	isItemMovement?: boolean
	isOrderMovement?: boolean

	createdByName?: string
}
export enum comment_variant {
	workshop_flow = 'workshop_flow',
	rent_flow = 'rent_flow',
	regular_comment = 'regular_comment'
}
export type CommentVariantType = keyof typeof comment_variant

export type FormattedComment = CommentBase &
	Partial<BaseType> & {
		createdByName?: string
		orderFolio?: string | number
		orderName?: string
		orderStatus?: string
		orderType?: order_type
	}

export type CommentType = CommentBase & BaseType
export type CreateCommentType = Omit<
	CommentType,
	'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'
>
