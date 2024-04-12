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

  const SALE_FLOW = [
    {
      label: 'Deliver',
      action: actions_fns[acts.DELIVER],
      status: order_status.DELIVERED
    }
  ]
  const RENT_FLOW = [
    {
      label: 'Authorize',
      action: actions_fns[acts.AUTHORIZE],
      status: order_status.AUTHORIZED
    },
    {
      label: 'Deliver',
      action: actions_fns[acts.DELIVER],
      status: order_status.DELIVERED
    },
    {
      label: 'Pickup',
      action: actions_fns[acts.PICKUP],
      status: order_status.PICKUP
    }
  ]
  const REPAIR_FLOW = [
    {
      label: 'Authorize',
      action: actions_fns[acts.AUTHORIZE],
      status: order_status.AUTHORIZED
    },
    {
      label: 'Pickup',
      action: actions_fns[acts.PICKUP],
      status: order_status.PICKUP
    },
    {
      label: 'Repair start',
      action: actions_fns[acts.REPAIR_START],
      status: order_status.REPAIRING
    },
    {
      label: 'Repair finish',
      action: actions_fns[acts.REPAIR_FINISH],
      status: order_status.REPAIRED
    },
    {
      label: 'Deliver',
      action: actions_fns[acts.DELIVER],
      status: order_status.DELIVERED
    }
  ]
  const ORDER_TYPE_ACTIONS = {
    RENT: RENT_FLOW,
    SALE: SALE_FLOW,
    REPAIR: REPAIR_FLOW
  }
  const statusIndex = ORDER_TYPE_ACTIONS[orderType].findIndex(
    (act) => act.status === orderStatus
  )
  const progress =
    ((statusIndex + 1) / ORDER_TYPE_ACTIONS[orderType].length) * 100
  return (
    <View>
      <OrderStatus orderId={orderId} />
      <OrderAssignInfo orderId={orderId} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        {ORDER_TYPE_ACTIONS[orderType].map(({ label, action }) => (
          <Button
            label={dictionary(label)}
            onPress={action}
            variant="ghost"
            size="xs"
          />
        ))}
      </View>
      <ProgressBar progress={progress} />
      <GeneralActions orderId={orderId} />
    </View>
  )
}

const GeneralActions = ({ orderId }) => {
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
