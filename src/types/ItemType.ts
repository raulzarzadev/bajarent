import BaseType from './BaseType'
import { CategoryType } from './RentItem'

export enum ItemStatuses {
  // available = 'available',
  rented = 'rented',
  //maintenance = 'maintenance',
  //sold = 'sold',
  //stock = 'stock',
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
}

type ItemType = BaseType & ItemBase

export default ItemType
