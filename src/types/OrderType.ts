import { FieldValue } from 'firebase/firestore'
import BaseType from './BaseType'
import { RentItem } from './RentItem'
import StoreType from './StoreType'

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

  comments: Comment[]
}

export type Comment = {
  type: 'report' | 'comment'
  content: string
  createAt: Date
  createdBy: string
  solved?: boolean
  solvedAt?: Date
  solvedBy?: string
  solvedComment?: string
}

export type OrderStatus =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REPORTED'

type OrderType = OrderBase & BaseType

export default OrderType
