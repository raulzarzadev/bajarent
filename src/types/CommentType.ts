import BaseType from './BaseType'
import { order_type } from './OrderType'

export type CommentBase = {
  id: string

  orderId: string
  storeId: string

  type: 'report' | 'comment' | 'payment' | 'important'
  status?: 'open' | 'close' | 'hidden'
  content: string

  solved?: boolean
  solvedAt?: Date
  solvedBy?: string
  solvedComment?: string
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
