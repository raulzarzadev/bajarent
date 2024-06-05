import BaseType from './BaseType'
import { CategoryType } from './RentItem'
export type ItemStatus =
  | 'available'
  | 'rented'
  | 'maintenance'
  | 'sold'
  | 'stock'

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
}

type ItemType = BaseType & ItemBase

export default ItemType
