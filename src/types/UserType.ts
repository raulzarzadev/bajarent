import BaseType from './BaseType'

export type UserBase = {
  name: string
  phone: string
  email: string
  image?: string
  // rol?: 'admin' | 'user'
  // super_user?: boolean
  canCreateStore?: boolean
  permissions?: UserPermissions
}

export type UserPermissions = {
  orders?: {
    canCreate?: boolean
    canViewAll?: boolean
    canEdit?: boolean
    canDelete?: boolean
    canAssign?: boolean
    canAuthorize?: boolean
    canRenew?: boolean
    canCancel?: boolean
    canPickup?: boolean
    canDelivery?: boolean
    canStartRepair?: boolean
    canFinishRepair?: boolean
    isAdmin?: boolean
    canSentWS?: boolean
    canReorder?: boolean
  }
  store?: {
    canCreateBalance?: boolean
    canViewBalances?: boolean
    canDeleteBalances?: boolean
    canSaveBalances?: boolean
  }
}

type UserType = BaseType & UserBase

export default UserType
