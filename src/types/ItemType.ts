import BaseType from './BaseType'
import { ContactType, OrderQuoteType } from './OrderType'
import { CategoryType } from './RentItem'
import { WorkshopFlow, WorkshopStatus } from './WorkshopType'

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
  workshopStatus?: WorkshopStatus
  isExternalRepair?: boolean
  /**
   * @deprecated use repairDescription
   */
  repairInfo?: string
  repairDetails?: RepairDetails
  workshopFlow?: WorkshopFlow
  [key: string]: any
}
export type RepairDetails = {
  failDescription?: string
  quotes?: OrderQuoteType[]
  clientName?: string
  contacts: ContactType[]
  address?: string
  location?: string
}
type ItemType = BaseType & ItemBase
export type ExternalRepairItemsProps = {
  repairDetails: RepairDetails
  orderId: string
  workshopStatus: ItemBase['workshopStatus']

  scheduledAt?: Date
}

export type ItemExternalRepairProps = ItemType & ExternalRepairItemsProps
export default ItemType
