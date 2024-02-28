import { FlatList, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import OrderType, { order_status } from '../types/OrderType'

import { ServiceOrders } from '../firebase/ServiceOrders'
import Button from './Button'
import { useStore } from '../contexts/storeContext'
import { useAuth } from '../contexts/authContext'

const OrderActionsRepairFlow = ({
  orderId,
  orderStatus
}: {
  orderId: string
  orderStatus: OrderType['status']
}) => {
  return (
    <View>
      <RentFlow orderId={orderId} orderStatus={orderStatus} />
    </View>
  )
}

const RentFlow = ({
  orderId,
  orderStatus
}: {
  orderId: string
  orderStatus: OrderType['status']
}) => {
  const { storeId, myStaffId: staffId, staffPermissions, store } = useStore()
  const { user } = useAuth()
  const isOwner = store?.createdBy === user?.id
  const isAdmin = staffPermissions?.isAdmin || isOwner
  const canAuthorizeOrder = staffPermissions?.canAuthorizeOrder
  const canDeliveryOrder = staffPermissions?.canDeliveryOrder
  const canRepairOrder = staffPermissions?.canRepairOrder
  // en reparación > reparada > entregar
  type Steps =
    | null
    | order_status.PENDING
    | order_status.AUTHORIZED
    | order_status.REPAIRING
    | order_status.REPAIRED
    | order_status.REPAIR_DELIVERED

  type Actions = {
    key: Steps
    should: Steps
    label: string
    undoLabel: string
    onPress: () => void
    disabled?: boolean
  }

  const [step, setStep] = useState<OrderType['status']>(orderStatus)

  const enableAuthorize = isAdmin || canAuthorizeOrder
  const enableRepair = isAdmin || canRepairOrder
  const enableFinishRepair = isAdmin || canRepairOrder
  const enableDeliveryRepair =
    !(step === order_status.RENEWED) || canDeliveryOrder

  const steps: Actions[] = [
    {
      key: order_status.AUTHORIZED,
      should: order_status.PENDING,
      label: 'Autorizar',
      undoLabel: 'Autorizada',
      disabled: !enableAuthorize,
      onPress: () => {
        if (step === order_status.AUTHORIZED) {
          setStep(order_status.PENDING)
          onAuthorize({ orderId, storeId, staffId, undo: true })
        } else {
          setStep(order_status.AUTHORIZED)
          onAuthorize({ orderId, storeId, staffId, undo: false })
        }
      }
    },
    {
      key: order_status.REPAIRING,
      should: order_status.AUTHORIZED,
      label: 'Reparar',
      undoLabel: 'En reparación',
      disabled: !enableRepair,
      onPress: () => {
        if (step === order_status.REPAIRING) {
          // * Undo it
          setStep(order_status.AUTHORIZED)
          onRepairStart({ orderId, storeId, staffId, undo: true })
        } else {
          //* Do it
          setStep(order_status.REPAIRING)
          onRepairStart({ orderId, storeId, staffId, undo: false })
        }
      }
    },

    {
      key: order_status.REPAIRED,
      should: order_status.REPAIRING,
      label: 'Terminar',
      undoLabel: 'Reparada',
      disabled: !enableFinishRepair,
      onPress: () => {
        if (step === order_status.REPAIRED) {
          setStep(order_status.REPAIRING)
          onFinishRepair({ orderId, storeId, staffId, undo: true })
        } else {
          setStep(order_status.REPAIRED)
          onFinishRepair({
            orderId,
            storeId,
            staffId,
            undo: false
          })

          // setStep(order_status.REPAIRED)
          // onFinishRepair({ orderId, storeId, staffId, undo: false })
        }
      }
    },
    {
      key: order_status.REPAIR_DELIVERED,
      should: order_status.REPAIRED,
      label: 'Entregar',
      undoLabel: 'Entregada',
      disabled: !enableDeliveryRepair,
      onPress: () => {
        if (step === order_status.REPAIR_DELIVERED) {
          onRepairStartRepair({ orderId, storeId, staffId, undo: true })
          setStep(order_status.REPAIRED)
        } else {
          onRepairStartRepair({ orderId, storeId, staffId, undo: false })
          setStep(order_status.REPAIR_DELIVERED)
        }
      }
    }
  ]
  return (
    <View
      style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: 16 }}
    >
      <FlatList
        horizontal
        data={steps}
        renderItem={({
          item: { label, onPress, should, undoLabel, key, disabled = false },
          index: i
        }) => {
          const enable = step === should || step === key
          return (
            <Button
              key={label}
              label={
                steps.findIndex((s) => s.key === step) < i ? label : undoLabel
              }
              disabled={!enable || disabled}
              size="xs"
              variant={key === step ? 'outline' : 'ghost'}
              onPress={() => {
                onPress()
              }}
            />
          )
        }}
      />
    </View>
  )
}

export default OrderActionsRepairFlow

const onAuthorize = ({ orderId, storeId, undo, staffId }) => {
  ServiceOrders.update(orderId, {
    status: undo ? order_status.PENDING : order_status.AUTHORIZED
  })
    .then(console.log)
    .catch(console.error)

  ServiceOrders.addComment({
    content: undo ? 'Orden no autorizada' : 'Orden autorizada',
    type: 'comment',
    orderId,
    storeId
  })
    .then(console.log)
    .catch(console.error)
}

const onRepairStart = ({ orderId, storeId, undo, staffId }) => {
  ServiceOrders.update(orderId, {
    status: undo ? order_status.AUTHORIZED : order_status.REPAIRING,
    deliveredAt: new Date(),
    deliveredByStaff: staffId
  })
    .then(console.log)
    .catch(console.error)
  ServiceOrders.addComment({
    storeId,
    orderId,
    type: 'comment',
    content: undo ? 'Reparación cancelada' : 'Reparacion comenzada'
  })
    .then(console.log)
    .catch(console.error)
}

const onFinishRepair = async ({ orderId, storeId, undo, staffId }) => {
  await ServiceOrders.update(orderId, {
    status: undo ? order_status.REPAIRING : order_status.REPAIRED,
    pickedUpAt: new Date(),
    pickedUpByStaff: staffId
  })
    .then(console.log)
    .catch(console.error)
  return await ServiceOrders.addComment({
    storeId,
    orderId,
    type: 'comment',
    content: undo ? 'Orden en reparación' : 'Orden reparada'
  })
    .then(console.log)
    .catch(console.error)
}

const onRepairStartRepair = ({ orderId, storeId, undo, staffId }) => {
  ServiceOrders.update(orderId, {
    status: undo ? order_status.REPAIRED : order_status.REPAIR_DELIVERED,
    deliveredAt: new Date(),
    deliveredByStaff: staffId
  })
    .then(console.log)
    .catch(console.error)
  ServiceOrders.addComment({
    storeId,
    orderId,
    type: 'comment',
    content: undo ? 'Orden terminada' : 'Orden entregada'
  })
    .then(console.log)
    .catch(console.error)
}
