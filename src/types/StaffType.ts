/* eslint-disable no-unused-vars */
import BaseType from './BaseType'
import StoreType from './StoreType'

export enum staff_permissions {
  isAdmin = 'isAdmin',
  canDeliveryOrder = 'canDeliveryOrder',
  canCancelOrder = 'canCancelOrder',
  canAuthorizeOrder = 'canAuthorizeOrder',
  canEditOrder = 'canEditOrder',
  canAssignOrder = 'canAssignOrder',
  canRenewOrder = 'canRenewOrder',
  canCreateOrder = 'canCreateOrder',
  canDeleteOrder = 'canDeleteOrder'
}

export type StaffPermissionType = {
  [K in keyof typeof staff_permissions]: boolean
}

export type BaseStaffType = {
  storeId: string
  position?: string
  userId: string

  //* this fields are provided by the user data
  name: string
  email?: string
  phone?: string

  store?: Partial<StoreType>
}

type StaffType = BaseType & BaseStaffType & StaffPermissionType

export type CreateStaffType = Partial<BaseStaffType>

export default StaffType
