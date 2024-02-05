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

  type: TypeOfOrderType
  hasNotSolvedReports?: boolean

  assignToSection?: string

  assignToPosition?: string
  assignToName?: string

  renewedAt: Date
  renewedFrom: string

  hasDelivered?: boolean

  //* to repair orders
  description?: string
  itemBrand?: string
  itemSerial?: string

  repairedAt?: Date
  repairedBy?: string

  repairTotal?: number
  repairInfo?: string
}

export enum order_status {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REPORTED = 'REPORTED',
  PICKUP = 'PICKUP',
  EXPIRED = 'EXPIRED',
  RENEWED = 'RENEWED',
  REPAIRING = 'REPAIRING',
  REPAIRED = 'REPAIRED'
}

export enum order_type {
  RENT = 'RENT',
  SALE = 'SALE',
  REPAIR = 'REPAIR'
}
export type TypeOfOrderType = order_type
export type OrderStatus = order_status

type OrderType = OrderBase & BaseType

export default OrderType
