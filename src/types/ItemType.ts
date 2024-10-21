import BaseType from './BaseType'
import { ContactType, OrderQuoteType } from './OrderType'
import { CategoryType } from './RentItem'
import { WorkshopFlow } from './WorkshopType'

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
  isExternalRepair?: boolean
  repairInfo?: string
  workshopFlow?: WorkshopFlow
  [key: string]: any
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
  orderId: string
  workshopStatus: ItemBase['workshopStatus']

  scheduledAt?: Date
}

export type ItemExternalRepairProps = ItemType & ExternalRepairItemsProps
export default ItemType
