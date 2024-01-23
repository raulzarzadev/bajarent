import BaseType from './BaseType'
import { RentItem } from './RentItem'

type OrderBase = {
  fistName: string
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

  items: RentItem[]
}

type OrderType = OrderBase & BaseType

export default OrderType
