import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {
  onAuthorize,
  onDelivery,
  onPickup,
  onRenew,
  onComment,
  onRepairStart,
  onRepairFinish,
  onCancel
} from '../libs/order-actions'
import dictionary from '../dictionary'
import { useAuth } from '../contexts/authContext'
import theme from '../theme'
import ProgressBar from './ProgressBar'
import OrderType, { order_status } from '../types/OrderType'
import Button from './Button'
import ModalAssignOrder from './OrderActions/ModalAssignOrder'
import ModalSendWhatsapp from './ModalSendWhatsapp'
import ModalWhatsAppOrderStatus from './OrderActions/ModalWhatsAppOrderStatus'
import OrderStatus from './OrderStatus'
import OrderAssignInfo from './OrderAssignInfo'

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
    [acts.AUTHORIZE]: () => onAuthorize({ orderId, userId }),
    [acts.DELIVER]: () => onDelivery({ orderId, userId }),
    [acts.PICKUP]: () => onPickup({ orderId, userId }),
    [acts.RENEW]: () => onRenew({ orderId, userId }),
    //[acts.COMMENT]: ()=>onComment({ orderId ,content,storeId,type}),
    [acts.REPAIR_START]: () => onRepairStart({ orderId, userId }),
    [acts.REPAIR_FINISH]: () => onRepairFinish({ orderId, userId }),
    [acts.CANCEL]: () => onCancel({ orderId, userId })
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

  const userCanRenew = true
  const userCanCancel = true
  const userCanEdit = true
  const userCanDelete = true
  const userCanSendWS = true
  const userCanAuthorize = true

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
      <GeneralActions
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

const GeneralActions = ({
  orderId,
  permissions
}: {
  orderId: string
  permissions: {
    canRenew?: boolean
    canCancel?: boolean
    canEdit?: boolean
    canDelete?: boolean
    canSendWS?: boolean
    canAuthorize?: boolean
  }
}) => {
  const { user } = useAuth()
  const userId = user?.id
  const buttons = [
    <ModalWhatsAppOrderStatus orderId={orderId} />,
    <Button
      label="Cancelar"
      onPress={() => {
        onCancel({ orderId, userId })
      }}
      size="small"
      variant="outline"
    />,
    <ModalAssignOrder orderId={orderId} />
  ]
  const buttons2 = [
    <Button
      size="small"
      label="Editar"
      onPress={() => {}}
      variant="outline"
      icon="edit"
    />,
    <Button
      size="small"
      label="Eliminar"
      onPress={() => {}}
      color="error"
      variant="outline"
      icon="delete"
    />
  ]
  return (
    <View>
      <View
        style={{
          marginTop: 8,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
          padding: 2,
          flexWrap: 'wrap'
        }}
      >
        {buttons.map((button, i) => (
          <View key={i} style={{ padding: 4, width: '50%' }}>
            {button}
          </View>
        ))}
        {/* To fix las element */}
        <View style={{ flex: 1 }} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
          padding: 2
        }}
      >
        {buttons2.map((button, i) => (
          <View key={i} style={{ padding: 4, width: '50%' }}>
            {button}
          </View>
        ))}
      </View>
    </View>
  )
}

export default OrderActions

const styles = StyleSheet.create({})
