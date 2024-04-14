/* eslint-disable no-unused-vars */
import BaseType from './BaseType'
import StoreType from './StoreType'

/**
 * @deprecated use staff_permissions_orders_v2 or staff_permissions_store_v2 instead
 */
export enum staff_permissions {
  isAdmin = 'isAdmin',
  canDeliveryOrder = 'canDeliveryOrder',
  canCancelOrder = 'canCancelOrder',
  canAuthorizeOrder = 'canAuthorizeOrder',
  canEditOrder = 'canEditOrder',
  canAssignOrder = 'canAssignOrder',
  canRenewOrder = 'canRenewOrder',
  canCreateOrder = 'canCreateOrder',
  canDeleteOrder = 'canDeleteOrder',
  canPickupOrder = 'canPickupOrder',
  canViewMyOrders = 'canViewMyOrders',
  canViewOrders = 'canViewOrders',
  canRepairOrder = 'canRepairOrder'
}

export enum staff_permissions_orders_v2 {
  canCreate,
  canViewAll,
  canEdit,
  canDelete,
  canAssign,
  canAuthorize,
  canRenew,
  canCancel,
  canPickup,
  canDelivery,
  canStartRepair,
  canFinishRepair,
  isAdmin,
  canSentWS,
  canReorder
}
export enum staff_permissions_store_v2 {
  canCreateBalance,
  canViewBalances,
  canDeleteBalances,
  canSaveBalances
}

/**
 * @deprecated use StaffPermissions instead
 */
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
  permissions?: StaffPermissions
}

type StaffType = BaseType & BaseStaffType & StaffPermissionType

export type CreateStaffType = Partial<BaseStaffType>

export default StaffType

export type StaffPermissionsOrders = keyof typeof staff_permissions_orders_v2
export type StaffPermissionsStore = keyof typeof staff_permissions_store_v2

export type StaffPermissions = {
  orders?: Partial<StaffPermissionsOrders>
  store?: Partial<StaffPermissionsStore>
}
