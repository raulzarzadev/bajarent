import {
  PermissionsOrder,
  PermissionsOrderType,
  PermissionsStore,
  PermissionsStoreType,
  StaffPermissions,
  permissionsOrderKeys,
  permissionsStoreKeys
} from '../types/StaffType'

export type PredefinedPermissions = {
  admin: StaffPermissions
  cashbox: StaffPermissions
  delivery: StaffPermissions
  workshop: StaffPermissions
  visit: StaffPermissions
}
export const predefinedPermissions: PredefinedPermissions = {
  admin: createPredefinedPermissions({
    allowedOrderActions: 'all',
    allowedStoreActions: 'all'
  }),
  visit: createPredefinedPermissions({
    allowedOrderActions: 'none',
    allowedStoreActions: 'none'
  }),
  cashbox: createPredefinedPermissions({
    allowedOrderActions: [
      'canAssign',
      'canAuthorize',
      'canCancel',
      'canDelete',
      'canViewAll',
      'canEdit',
      'canCreate',
      'canReorder',
      'canRenew',
      'canSentWS',
      'canStartRepair',
      'canFinishRepair'
    ],
    allowedStoreActions: [
      'canCreateBalance',
      'canViewBalances',
      'canSaveBalances'
    ]
  }),
  delivery: createPredefinedPermissions({
    allowedOrderActions: [
      'canAuthorize',
      'canCreate',
      'canDelivery',
      'canPickup',
      'canReorder',
      'canSentWS'
    ],
    allowedStoreActions: 'none'
  }),
  workshop: createPredefinedPermissions({
    allowedOrderActions: [
      'canFinishRepair',
      'canStartRepair',
      'canSentWS',
      'canDelivery',
      'canPickup',
      'canReorder',
      'canCreate',
      'canAuthorize'
    ],
    allowedStoreActions: 'none'
  })
}

/**
 * This function creates a new set of permissions you just should pass permissions allowed and it will return a new set of permissions with the allowed permissions and denied the rest
 * @param permissions
 */

function createPredefinedPermissions({
  allowedOrderActions = [],
  allowedStoreActions = []
}: {
  allowedOrderActions?: (keyof PermissionsOrder)[] | 'all' | 'none'
  allowedStoreActions?: (keyof PermissionsStore)[] | 'all' | 'none'
}): StaffPermissions {
  const predefinedPermissions = {
    order: {} as PermissionsOrder,
    store: {} as PermissionsStore
  }

  permissionsOrderKeys.forEach((key: PermissionsOrderType) => {
    if (allowedOrderActions === 'all')
      return (predefinedPermissions.order[key] = true)
    if (allowedOrderActions === 'none')
      return (predefinedPermissions.order[key] = false)
    return (predefinedPermissions.order[key] =
      allowedOrderActions.includes(key))
  })

  permissionsStoreKeys.forEach((key: PermissionsStoreType) => {
    if (allowedStoreActions === 'all')
      return (predefinedPermissions.store[key] = true)
    if (allowedStoreActions === 'none')
      return (predefinedPermissions.store[key] = false)
    return (predefinedPermissions.store[key] =
      allowedStoreActions.includes(key))
  })

  return predefinedPermissions
}
