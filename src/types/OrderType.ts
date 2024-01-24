import { FieldValue } from 'firebase/firestore'
import BaseType from './BaseType'
import { RentItem } from './RentItem'
import StoreType from './StoreType'
import { CommentType } from './CommentType'

type OrderBase = {
  storeId: StoreType['id']

  firstName: string
  lastName: string
  email: string
  phone: string

  imageID: string
  imageHouse: string

  street: string
  betweenStreets: string
  neighborhood: string
  location: string
  indications: string

  assignTo: string
  scheduledAt: Date

  deliveredAt: Date
  deliveredBy: string

  items: RentItem[]

  status: OrderStatus

  comments: CommentType[]
}

export type OrderStatus =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REPORTED'
  | 'PICKUP'

type OrderType = OrderBase & BaseType

export default OrderType
