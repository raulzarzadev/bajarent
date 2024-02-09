import { FlatList, StyleSheet, View } from 'react-native'
import React, { Dispatch, SetStateAction, useState } from 'react'
import OrderType, { order_status } from '../types/OrderType'
import { useNavigation } from '@react-navigation/native'
import { ServiceOrders } from '../firebase/ServiceOrders'
import Button from './Button'
import { useStore } from '../contexts/storeContext'
import useModal from '../hooks/useModal'
import { useAuth } from '../contexts/authContext'
import StyledModal from './StyledModal'
import InputTextStyled from './InputTextStyled'

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
  const {
    storeId,
    myStaffId: staffId,
    staffPermissions: {
      isAdmin,
      canAuthorizeOrder,
      canDeliveryOrder,
      canRepairOrder
    }
  } = useStore()

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
    // undo: () => void
  }

  const [step, setStep] = useState<OrderType['status']>(orderStatus)

  const enableAuthorize = isAdmin || canAuthorizeOrder
  const enableRepair = isAdmin || canRepairOrder
  const enableFinishRepair = isAdmin || canRepairOrder
  const enableDeliveryRepair =
    !(step === order_status.RENEWED) || canDeliveryOrder
  const modalFinishRepair = useModal({ title: 'Detalles de reparación' })
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
          console.log('open modal')

          modalFinishRepair.toggleOpen()

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
      <ModalFinishRepair
        {...modalFinishRepair}
        orderId={orderId}
        handleOrderUpdate={async () => {
          console.log('finished')
          setStep(order_status.REPAIRED)
          return await onFinishRepair({
            orderId,
            storeId,
            staffId,
            undo: false
          })
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

const ModalFinishRepair = ({
  orderId,
  open,
  setOpen,
  title,
  toggleOpen,
  handleOrderUpdate
}: {
  orderId: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  title: string
  toggleOpen: () => any
  handleOrderUpdate: () => any
}) => {
  const { user } = useAuth()
  const { myStaffId, storeId } = useStore()
  const [info, setInfo] = useState('')
  const [total, setTotal] = useState(0)
  const [saving, setSaving] = useState(false)
  const handleRepairFinished = async () => {
    setSaving(true)
    await ServiceOrders.repaired(orderId, {
      info,
      total,
      repairedBy: user.id,
      repairedByStaff: myStaffId
    })
      .then(console.log)
      .catch(console.error)
    await ServiceOrders.addComment({
      storeId,
      orderId,
      type: 'comment',
      content: 'Reparación terminada'
    })
      .then(console.log)
      .catch(console.error)

    await handleOrderUpdate()
    setSaving(false)
    setOpen(false)
  }
  return (
    <>
      <StyledModal open={open} setOpen={setOpen} title={title}>
        <View style={styles.repairItemForm}>
          <InputTextStyled
            placeholder="Descripción de reparación"
            numberOfLines={3}
            multiline
            onChangeText={setInfo}
          ></InputTextStyled>
        </View>
        <View style={styles.repairItemForm}>
          <InputTextStyled
            keyboardType="numeric"
            placeholder="Total $ "
            onChangeText={(value) => {
              setTotal(parseFloat(value) || 0)
            }}
          ></InputTextStyled>
        </View>
        <View style={styles.repairItemForm}>
          <Button
            disabled={saving}
            onPress={handleRepairFinished}
            color="success"
          >
            Terminar
          </Button>
        </View>
      </StyledModal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  item: {
    width: '48%', // for 2 items in a row
    marginVertical: '1%' // spacing between items
  },
  repairItemForm: {
    marginVertical: 4
  }
})
