import BaseType from './BaseType'
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
  workshopStatus?: 'inProgress' | 'pending' | 'finished'
}

type ItemType = BaseType & ItemBase

export default ItemType
