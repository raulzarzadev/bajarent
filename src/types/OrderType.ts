import { FieldValue } from 'firebase/firestore'
import BaseType from './BaseType'
import { RentItem } from './RentItem'
import StoreType from './StoreType'
import { CommentType } from './CommentType'

type OrderBase = {
  folio: number
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
  item: RentItem

  status: OrderStatus

  comments: CommentType[]

  type: 'RENT' | 'SALE' | 'REPAIR'

  hasNotSolvedReports?: boolean
}

export enum order_status {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REPORTED = 'REPORTED',
  PICKUP = 'PICKUP'
}

export enum order_type {
  RENT,
  SALE,
  REPAIR
}

export type OrderStatus = order_status
// | 'PENDING'
// | 'AUTHORIZED'
// | 'DELIVERED'
// | 'CANCELLED'
// | 'REPORTED'
// | 'PICKUP'

type OrderType = OrderBase & BaseType

export default OrderType
