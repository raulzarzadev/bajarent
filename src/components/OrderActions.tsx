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
  console.log({ progress, statusIndex, orderStatus })
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        {ORDER_TYPE_ACTIONS[orderType].map(({ label, action }) => (
          <Pressable
            key={label}
            onPress={() => {
              action()
            }}
          >
            <Text key={label} style={{ textTransform: 'capitalize' }}>
              {dictionary(label)}
            </Text>
          </Pressable>
        ))}
      </View>
      <ProgressBar progress={progress} />
      <View style={{ marginTop: 8, flexDirection: 'row' }}>
        <Button
          label="Cancelar"
          onPress={actions_fns[acts.CANCEL]}
          size="small"
          variant="outline"
        />
      </View>
    </View>
  )
}

export default OrderActions

const styles = StyleSheet.create({})
