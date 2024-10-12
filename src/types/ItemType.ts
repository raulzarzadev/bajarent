import BaseType from './BaseType'
import OrderType, { ContactType, OrderQuoteType } from './OrderType'
import { CategoryType } from './RentItem'

export enum ItemStatuses {
  rented = 'rented',
  pickedUp = 'pickedUp',
  retired = 'retired'
}
export type ItemStatus = keyof typeof ItemStatuses

export type ItemBase = {
  number: string
  serial: string
  brand: string
  status: ItemStatus
  /**
   * @description category id
   */
  category: CategoryType['id']
  assignedSection?: string
  categoryName?: string
  assignedSectionName?: string
  currentOrderId?: string
  currentLocation?: string
  needFix?: boolean
  isRented?: boolean
  isPickedUp?: boolean
  retiredAt?: Date
  retiredBy?: string
  lastInventoryAt?: Date
  lastInventoryBy?: string
  workshopStatus?:
    | 'inProgress'
    | 'pending'
    | 'finished'
    | 'shouldPickup'
    | 'delivered'
}

type ItemType = BaseType & ItemBase
export type ExternalRepairItemsProps = {
  repairDetails: {
    failDescription?: string
    quotes?: OrderQuoteType[]
    clientName?: string
    contacts: ContactType[]
    address?: string
    location?: string
  }
  isExternalRepair?: boolean
  orderId: string
  workshopStatus: ItemBase['workshopStatus']
}
export type ItemExternalRepairProps = ItemType & ExternalRepairItemsProps
export default ItemType
