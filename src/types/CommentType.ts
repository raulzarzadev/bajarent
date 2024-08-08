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

  isReport?: boolean
  isImportant?: boolean
  isPayment?: boolean
  isItemMovement?: boolean
  isOrderMovement?: boolean
}

export type FormattedComment = CommentBase &
  BaseType & {
    createdByName: string
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
