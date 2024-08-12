/* eslint-disable no-unused-vars */
import { FieldValue } from 'firebase/firestore'
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

/**
 * @deprecated use StaffPermissions instead
 */
export type StaffPermissionType = {
  [K in keyof typeof staff_permissions]: boolean | FieldValue
}
export type PinnedRow = {
  type: string
  id: string
}
export type StaffPinnedRow = {
  [id: string]: PinnedRow
}

export type old_StaffPermissionType = StaffPermissionType
export type BaseStaffType = {
  storeId: string
  position?: string
  userId: string

  //* this fields are provided by the user data
  name: string
  email?: string
  phone?: string
  sectionsAssigned?: string[]
  store?: Partial<StoreType>

  /**
   * @deprecated use permissions.isOwner instead
   */

  permissions?: StaffPermissions
  /**
   * @deprecated use permissions.isOwner instead
   */
  predefinedPermission?: string
  /**
   * @deprecated use permissions.isOwner instead
   */
  isOwner?: boolean
}

type StaffType = BaseType & BaseStaffType & StaffPermissionType

export type CreateStaffType = Partial<BaseStaffType>

export default StaffType

/* ********************************************
 * PERMISSIONS V2
 *******************************************rz */
export enum permissions_orders {
  canCreate,
  canViewAll,
  canViewMy,
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
  canSentWS,
  canReorder,
  canUndo,
  canUnAuthorize,
  canExtend,
  // showOrderTotal,
  // showOrderTime,
  getExpireTomorrow,
  canDeleteExtension,
  canCancelPickedUp
}
export enum permissions_store {
  canCreateBalance,
  canViewBalances,
  canDeleteBalances,
  canSaveBalances,
  canViewCashbox,
  canViewItems,
  canEditStaff,
  canCancelPayments,
  canValidatePayments,
  canDeleteItems,
  canManageItems
}

export type PermissionsOrder = Record<keyof typeof permissions_orders, boolean>
export type PermissionsStore = Partial<
  Record<keyof typeof permissions_store, boolean>
>

export type StaffPermissions = {
  isOwner?: boolean
  isAdmin?: boolean
  order?: Partial<PermissionsOrder>
  store?: Partial<PermissionsStore>
}

export type PermissionsOrderType = keyof typeof permissions_orders
export type PermissionsStoreType = keyof typeof permissions_store

export const permissionsOrderKeys = Object.keys(permissions_orders).filter(
  (key) => isNaN(Number(key))
)

export const permissionsStoreKeys = Object.keys(permissions_store).filter(
  (key) => isNaN(Number(key))
)
