import { View } from 'react-native'
import {
  onDelivery,
  onPickup,
  onRenew,
  onRepairStart,
  onRepairFinish
} from 'libs/order-actions'
import { useAuth } from 'contexts/authContext'
import OrderType, { order_status } from 'types/OrderType'
import OrderStatus from 'components/OrderStatus'
import OrderAssignInfo from 'components/OrderAssignInfo'
import Button from 'components/Button'
import dictionary from 'dictionary'
import ProgressBar from 'components/ProgressBar'
import OrderCommonActions from './OrderCommonActions'

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

export type OrderTypes = 'RENT' | 'SALE' | 'REPAIR'

const OrderActions = ({
  orderId,
  orderType,
  orderStatus
}: {
  orderId: string
  orderType: OrderTypes
  orderStatus: OrderType['status']
}) => {
  const { user } = useAuth()
  const userId = user?.id

  // Resume in one place tha functions that will be called some times
  const actions_fns = {
    [acts.DELIVER]: () => onDelivery({ orderId, userId }),
    [acts.PICKUP]: () => onPickup({ orderId, userId }),
    [acts.RENEW]: () => onRenew({ orderId, userId }),
    [acts.REPAIR_START]: () => onRepairStart({ orderId, userId }),
    [acts.REPAIR_FINISH]: () => onRepairFinish({ orderId, userId })
    //* this are part of common actions
    //[acts.COMMENT]: ()=>onComment({ orderId ,content,storeId,type}),
    //[acts.AUTHORIZE]: () => onAuthorize({ orderId, userId }),
    //[acts.CANCEL]: () => onCancel({ orderId, userId })
  }

  //TODO: should not be able to do some actions depends of the status // yes , absolutely
  //TODO: should not be able to do some actions depends of the permissions // yes , absolutely
  //* the things is that some actions should change props like deliveredAt, authorizedAt, etc, this is ok but
  //* you want to be shure that not change this props if the status is not the correct one
  // if rent is expired -> can't cancel delivered authorized
  // if rent is expired -> just can renew or pickup

  // rent can deliver -> is authorized
  // rent can pickup -> is delivered , expired
  // rent can renew -> is delivered , expired
  // rent can cancel -> is pending, authorized

  /* ********************************************
   * USER PERMISSIONS
   *******************************************rz */
  const userOrderPermissions = user?.permissions?.orders
  const userCanAuthorize = userOrderPermissions?.canAuthorize
  const userCanRenew = userOrderPermissions?.canRenew
  const userCanCancel = userOrderPermissions?.canCancel
  const userCanEdit = userOrderPermissions?.canEdit
  const userCanDelete = userOrderPermissions?.canDelete
  const userCanSendWS = userOrderPermissions?.canSentWS

  /* ********************************************
   * ORDER ACTIONS ALLOWED
   *******************************************rz */

  /* ********************************************
   * IF ORDER IS RENT
   *******************************************rz */

  const isRent = orderType === 'RENT'

  //****DELIVER JUST IF IS AUTH
  const canDeliverRent = isRent && orderStatus === order_status.AUTHORIZED
  //**** PICKUP JUST IF IS DELIVERED OR EXPIRED
  const canPickupRent =
    isRent &&
    (orderStatus === order_status.DELIVERED ||
      orderStatus === order_status.EXPIRED)
  //**** RENEW JUST IF IS DELIVERED OR EXPIRED
  const canRenewRent =
    isRent &&
    (orderStatus === order_status.DELIVERED ||
      orderStatus === order_status.EXPIRED)

  //**** CANCEL JUST IF IS PENDING OR AUTHORIZED
  const canCancelRent =
    isRent &&
    (orderStatus === order_status.PENDING ||
      orderStatus === order_status.AUTHORIZED)

  /* ********************************************
   * IF ORDER IS REPAIR
   *******************************************rz */

  const isRepair = orderType === 'REPAIR'

  //**** PICKUP JUST IF IS AUTHORIZED
  const canPickupRepair = isRepair && orderStatus === order_status.AUTHORIZED
  //**** REPAIR START JUST IF IS AUTHORIZED
  const canStartRepair = isRepair && orderStatus === order_status.PICKED_UP
  //**** REPAIR FINISH JUST IF IS REPAIRING
  const canFinishRepair = isRepair && orderStatus === order_status.REPAIRING
  //**** DELIVER JUST IF IS REPAIRED
  const canDeliverRepair = isRepair && orderStatus === order_status.REPAIRED
  //**** CANCEL JUST IF IS PENDING OR AUTHORIZED
  const canCancelRepair =
    isRepair &&
    (orderStatus === order_status.PENDING ||
      orderStatus === order_status.AUTHORIZED)

  /* ********************************************
   * IF ORDER IS SALE
   *******************************************rz */

  const isSale = orderType === 'SALE'
  //****DELIVER JUST IF IS AUTH
  const canDeliverSale = isSale && orderStatus === order_status.AUTHORIZED
  //**** CANCEL JUST IF IS PENDING OR AUTHORIZED OR DELIVERED
  const canCancelSale =
    isSale &&
    (orderStatus === order_status.PENDING ||
      orderStatus === order_status.AUTHORIZED ||
      orderStatus === order_status.DELIVERED)

  /* ********************************************
   * ORDER FLOWS
   *******************************************rz */

  const SALE_FLOW = [
    {
      label: 'Deliver',
      action: actions_fns[acts.DELIVER],
      status: order_status.DELIVERED,
      disabled: !canDeliverSale
    }
  ]
  const RENT_FLOW = [
    {
      label: 'Deliver',
      action: actions_fns[acts.DELIVER],
      status: order_status.DELIVERED,
      disabled: !canDeliverRent
    },
    {
      label: 'Pickup',
      action: actions_fns[acts.PICKUP],
      status: order_status.PICKUP,
      disabled: !canPickupRent
    }
  ]
  const REPAIR_FLOW = [
    {
      label: 'Pickup',
      action: actions_fns[acts.PICKUP],
      status: order_status.PICKUP,
      disabled: !canPickupRepair
    },
    {
      label: 'Repair start',
      action: actions_fns[acts.REPAIR_START],
      status: order_status.REPAIRING,
      disabled: !canStartRepair
    },
    {
      label: 'Repair finish',
      action: actions_fns[acts.REPAIR_FINISH],
      status: order_status.REPAIRED,
      disabled: !canFinishRepair
    },
    {
      label: 'Deliver',
      action: actions_fns[acts.DELIVER],
      status: order_status.DELIVERED,
      disabled: !canDeliverRepair
    }
  ]
  const ORDER_TYPE_ACTIONS = {
    RENT: RENT_FLOW,
    SALE: SALE_FLOW,
    REPAIR: REPAIR_FLOW
  }

  /* ********************************************
   * ORDER PROGRESS FLOW
   *******************************************rz */

  const statusIndex = ORDER_TYPE_ACTIONS[orderType].findIndex(
    (act) => act.status === orderStatus
  )
  const progress =
    ((statusIndex + 1) / ORDER_TYPE_ACTIONS[orderType].length) * 100

  /* ********************************************
   * RESUME
   *******************************************rz */

  const canRenew =
    userCanCancel && (canCancelRent || canCancelRepair || canCancelSale)
  const canCancel = userCanRenew && canRenewRent
  const canEdit = userCanEdit
  const canDelete = userCanDelete
  const canSendWS = userCanSendWS
  const canAuthorize = userCanAuthorize

  return (
    <View>
      <OrderStatus orderId={orderId} />
      <OrderAssignInfo orderId={orderId} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        {ORDER_TYPE_ACTIONS[orderType].map(({ label, action, disabled }) => (
          <Button
            label={dictionary(label)}
            onPress={action}
            variant="ghost"
            size="xs"
            disabled={disabled}
          />
        ))}
      </View>
      <ProgressBar progress={progress} />
      <OrderCommonActions
        orderId={orderId}
        permissions={{
          canRenew,
          canCancel,
          canEdit,
          canDelete,
          canSendWS,
          canAuthorize
        }}
      />
    </View>
  )
}

export default OrderActions
