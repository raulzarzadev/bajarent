import { FlatList, View } from 'react-native'
import React, { useState } from 'react'
import OrderType, { order_status } from '../types/OrderType'
import { useNavigation } from '@react-navigation/native'
import { ServiceOrders } from '../firebase/ServiceOrders'
import Button from './Button'
import { useStore } from '../contexts/storeContext'
import { useAuth } from '../contexts/authContext'
export type Action =
  | 'authorize'
  | 'deliver'
  | 'pickup'
  | 'renew'
  | 'cancel'
  | 'renew'
const OrderActionsRentFlow = ({
  orderId,
  orderStatus,
  actions
}: {
  orderId: string
  orderStatus: OrderType['status']
  actions: Action
}) => {
  const [currentStep, setCurrentStep] =
    useState<OrderType['status']>(orderStatus)
  const _steps: Action[] = [
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
      key: order_status.DELIVERED,
      should: order_status.AUTHORIZED,
      label: 'Entregar',
      undoLabel: 'Entregada',
      disabled: !enableDelivery,
      onPress: () => {
        if (step === order_status.DELIVERED) {
          // * Undo it
          setStep(order_status.AUTHORIZED)
          onDelivery({ orderId, storeId, staffId, undo: true })
        } else {
          //* Do it
          setStep(order_status.DELIVERED)
          onDelivery({ orderId, storeId, staffId, undo: false })
        }
      }
    },

    {
      key: order_status.PICKUP,
      should: order_status.DELIVERED,
      label: 'Recoger',
      undoLabel: 'Recogida',
      disabled: !enablePickup,
      onPress: () => {
        if (step === order_status.PICKUP) {
          setStep(order_status.DELIVERED)
          onPickup({ orderId, storeId, staffId, undo: true })
        } else {
          setStep(order_status.PICKUP)
          onPickup({ orderId, storeId, staffId, undo: false })
        }
      }
    },
    {
      key: order_status.RENEWED,
      should: order_status.DELIVERED,
      label: 'Renovar',
      undoLabel: 'Renovada',
      disabled: !enableRenew,
      onPress: () => {
        if (!(step === order_status.RENEWED)) {
          // @ts-ignore
          navigate('RenewOrder', { orderId })
        }
      }
    }
  ]
  const steps = actions
  return (
    <View
      style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: 16 }}
    >
      <FlatList
        horizontal
        data={steps}
        renderItem={({
          item: { label, disabled = false, action, undoAction },
          index: i
        }) => {
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
                action()
              }}
            />
          )
        }}
      />
    </View>
  )
  return <View></View>
}

const RentFlow = ({
  orderId,
  orderStatus
}: {
  orderId: string
  orderStatus: OrderType['status']
}) => {
  const { navigate } = useNavigation()
  const { storeId, myStaffId: staffId, staffPermissions, store } = useStore()
  const { user } = useAuth()
  const isOwner = store?.createdBy === user?.id
  const isAdmin = staffPermissions?.isAdmin || isOwner
  const canAuthorizeOrder = staffPermissions?.canAuthorizeOrder
  const canPickupOrder = staffPermissions?.canPickupOrder
  const canRenewOrder = staffPermissions?.canRenewOrder
  const canDeliveryOrder = staffPermissions?.canDeliveryOrder

  // autorizar > entregar > renovar > recoger
  type Steps =
    | null
    | order_status.PENDING
    | order_status.AUTHORIZED
    | order_status.DELIVERED
    | order_status.RENEWED
    | order_status.PICKUP

  type Actions = {
    key: Steps
    should: Steps
    label: string
    undoLabel: string
    onPress: () => void
    disabled?: boolean
    // undo: () => void
  }
  // ? Should change order status to DELIVERED and add a extra prop called isExpired instead change the status
  const [step, setStep] = useState<OrderType['status']>(orderStatus)

  // const enableRenew = !(step === order_status.RENEWED) || canRenewOrder
  const enableRenew = isAdmin || canRenewOrder
  const enablePickup = isAdmin || canPickupOrder
  const enableDelivery = isAdmin || canDeliveryOrder
  const enableAuthorize = isAdmin || canAuthorizeOrder

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
      key: order_status.DELIVERED,
      should: order_status.AUTHORIZED,
      label: 'Entregar',
      undoLabel: 'Entregada',
      disabled: !enableDelivery,
      onPress: () => {
        if (step === order_status.DELIVERED) {
          // * Undo it
          setStep(order_status.AUTHORIZED)
          onDelivery({ orderId, storeId, staffId, undo: true })
        } else {
          //* Do it
          setStep(order_status.DELIVERED)
          onDelivery({ orderId, storeId, staffId, undo: false })
        }
      }
    },

    {
      key: order_status.PICKUP,
      should: order_status.DELIVERED,
      label: 'Recoger',
      undoLabel: 'Recogida',
      disabled: !enablePickup,
      onPress: () => {
        if (step === order_status.PICKUP) {
          setStep(order_status.DELIVERED)
          onPickup({ orderId, storeId, staffId, undo: true })
        } else {
          setStep(order_status.PICKUP)
          onPickup({ orderId, storeId, staffId, undo: false })
        }
      }
    },
    {
      key: order_status.RENEWED,
      should: order_status.DELIVERED,
      label: 'Renovar',
      undoLabel: 'Renovada',
      disabled: !enableRenew,
      onPress: () => {
        if (!(step === order_status.RENEWED)) {
          // @ts-ignore
          navigate('RenewOrder', { orderId })
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
          let enable
          // * This fix the issue with the expired status cant pick up or renew. But should be better if we add a isExpired prop
          if (step === order_status.EXPIRED) {
            if (key === order_status.PICKUP || key === order_status.RENEWED) {
              enable = true
            }
          } else {
            enable = step === should || step === key
          }
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

      {/* {steps.map(
        ({ label, onPress, should, undoLabel, key, disabled = false }, i) => {
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
        }
      )} */}
    </View>
  )
}

export default OrderActionsRentFlow

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

const onDelivery = ({ orderId, storeId, undo, staffId }) => {
  ServiceOrders.update(orderId, {
    status: undo ? order_status.AUTHORIZED : order_status.DELIVERED,
    deliveredAt: new Date(),
    deliveredByStaff: staffId
  })
    .then(console.log)
    .catch(console.error)
  ServiceOrders.addComment({
    storeId,
    orderId,
    type: 'comment',
    content: undo ? 'Orden no entregada' : 'Orden entregada'
  })
    .then(console.log)
    .catch(console.error)
}

const onPickup = ({ orderId, storeId, undo, staffId }) => {
  ServiceOrders.update(orderId, {
    status: undo ? order_status.DELIVERED : order_status.PICKUP,
    pickedUpAt: new Date(),
    pickedUpByStaff: staffId
  })
    .then(console.log)
    .catch(console.error)
  ServiceOrders.addComment({
    storeId,
    orderId,
    type: 'comment',
    content: undo ? 'Orden regresada' : 'Orden recogida'
  })
    .then(console.log)
    .catch(console.error)
}
