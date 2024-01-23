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
}

export type OrderStatus =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REPORT'

type OrderType = OrderBase & BaseType

export default OrderType
