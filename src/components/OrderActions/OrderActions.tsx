import { View } from 'react-native'
import { useAuth } from '../../contexts/authContext'
import OrderType, { order_status } from '../../types/OrderType'
import OrderCommonActions from './OrderCommonActions'
import { useEmployee } from '../../contexts/employeeContext'
import ErrorBoundary from '../ErrorBoundary'

// #region ENUM ACTIONS
enum acts {
  AUTHORIZE = 'AUTHORIZE',
  DELIVER = 'DELIVER',
  PICKUP = 'PICKUP',
  RENEW = 'RENEW',
  COMMENT = 'COMMENT',
  REPAIR_START = 'REPAIR_START',
  REPAIR_FINISH = 'REPAIR_FINISH',
  CANCEL = 'CANCEL'
}

// #region TYPES
export type OrderTypes = 'RENT' | 'SALE' | 'REPAIR'
export type OrderActionsType = {
  orderId: string
  orderType: OrderTypes
  orderStatus: OrderType['status']
  storeId: string
}

// #region FUNCTION
const OrderActions = ({
  orderId,
  orderType,
  orderStatus,
  storeId
}: OrderActionsType) => {
  const { permissions } = useEmployee()
  const { user } = useAuth()
  const userId = user?.id

  // #region USER PERMISSIONS
  /* ********************************************
   * USER PERMISSIONS
   *******************************************rz */
  const employeeOrderPermissions = permissions?.orders
  const isAdmin = permissions.isAdmin
  const isOwner = permissions.isOwner

  const userCanAuthorize =
    employeeOrderPermissions?.canAuthorize || isAdmin || isOwner
  const userCanRenew = employeeOrderPermissions?.canRenew || isAdmin || isOwner
  const userCanCancel =
    employeeOrderPermissions?.canCancel || isAdmin || isOwner
  const userCanEdit = employeeOrderPermissions?.canEdit || isAdmin || isOwner
  const userCanDelete =
    employeeOrderPermissions?.canDelete || isAdmin || isOwner
  const userCanSendWS =
    employeeOrderPermissions?.canSentWS || isAdmin || isOwner
  const userCanAssign =
    employeeOrderPermissions?.canAssign || isAdmin || isOwner
  const userCanReorder =
    employeeOrderPermissions?.canReorder || isAdmin || isOwner
  const userCanExtend =
    employeeOrderPermissions?.canExtend || isAdmin || isOwner
  /* ********************************************
   * ORDER ACTIONS ALLOWED
   *******************************************rz */

  /* ********************************************
   * IF ORDER IS RENT
   *******************************************rz */

  const isRent = orderType === 'RENT'

  const canAuthorize =
    userCanAuthorize &&
    (orderStatus === order_status.PENDING ||
      orderStatus === order_status.CANCELLED)

  const canRenew =
    userCanRenew &&
    (orderStatus === order_status.DELIVERED ||
      orderStatus === order_status.EXPIRED)

  const canCancel =
    userCanCancel &&
    (orderStatus === order_status.PENDING ||
      orderStatus === order_status.AUTHORIZED)

  const canExtend =
    isRent &&
    userCanExtend &&
    (orderStatus === order_status.DELIVERED ||
      orderStatus === order_status.EXPIRED)

  const canReorder = userCanReorder

  const canEdit = userCanEdit
  const canDelete = userCanDelete
  const canSendWS = userCanSendWS
  const canAssign = userCanAssign

  //TODO: check if this is correct

  return (
    <View>
      <OrderCommonActions
        storeId={storeId}
        userId={userId}
        orderId={orderId}
        actionsAllowed={{
          canRenew,
          canCancel,
          canEdit,
          canDelete,
          canSendWS,
          canAuthorize,
          canAssign,
          canReorder,
          canExtend
        }}
      />
    </View>
  )
}

//#region Error boundary
export const OrderActionsE = (props: OrderActionsType) => {
  return (
    <ErrorBoundary componentName="OrderActions">
      <OrderActions {...props} />
    </ErrorBoundary>
  )
}
export default OrderActions
