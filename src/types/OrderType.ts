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
  expireAt?: Date | null

  status: OrderStatus

  comments: CommentType[]

  type: 'RENT' | 'SALE' | 'REPAIR'

  hasNotSolvedReports?: boolean

  assignToPosition?: string
  assignToName?: string

  renewedAt: Date
  renewedFrom: string

  hasDelivered: boolean

  //* to repair orders
  description: string
  itemBrand: string
  itemSerial: string
}

export enum order_status {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REPORTED = 'REPORTED',
  PICKUP = 'PICKUP',
  EXPIRED = 'EXPIRED',
  RENEWED = 'RENEWED'
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
