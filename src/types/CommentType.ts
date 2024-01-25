import BaseType from './BaseType'

export type CommentBase = {
  id: string

  orderId: string
  storeId: string

  type: 'report' | 'comment'
  status?: 'open' | 'close' | 'hidden'
  content: string

  solved?: boolean
  solvedAt?: Date
  solvedBy?: string
  solvedComment?: string
}

export type CommentType = CommentBase & BaseType
export type CreateCommentType = Omit<
  CommentType,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'
>
