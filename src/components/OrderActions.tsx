import { StyleSheet, View } from 'react-native'
import Button from './Button'
import P from './P'
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderType, { order_status, order_type } from '../types/OrderType'
import OrderStatus from './OrderStatus'
import orderStatus from '../libs/orderStatus'
import { useNavigation } from '@react-navigation/native'
import { useStore } from '../contexts/storeContext'
import { useAuth } from '../contexts/authContext'
import ModalAssignOrder from './OrderActions/ModalAssignOrder'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import InputTextStyled from './InputTextStyled'
import { useState } from 'react'

const OrderActions = ({ order }: { order: Partial<OrderType> }) => {
  const { staffPermissions } = useStore()
  const navigation = useNavigation()
  const status = orderStatus(order)
  const areIn = (statuses: order_status[]) => statuses.includes(status)
  const orderId = order?.id || ''

  const canDelivery =
    areIn([order_status.AUTHORIZED]) &&
    (staffPermissions.canDeliveryOrder || staffPermissions.isAdmin)

  const canCancel =
    areIn([order_status.PENDING, order_status.AUTHORIZED]) &&
    staffPermissions.isAdmin

  const canRenew =
    areIn([order_status.DELIVERED]) &&
    (staffPermissions.canRenewOrder || staffPermissions.isAdmin)

  const canAuthorize =
    areIn([order_status.PENDING]) &&
    (staffPermissions.canAuthorizeOrder || staffPermissions.isAdmin)
  const canPickup =
    areIn([order_status.DELIVERED]) &&
    (staffPermissions.canPickupOrder || staffPermissions.isAdmin)

  const canReturn = areIn([order_status.PICKUP]) && staffPermissions.isAdmin

  const canAssign = staffPermissions.canAssignOrder || staffPermissions.isAdmin

  const canEdit = staffPermissions.canEditOrder || staffPermissions.isAdmin

  const canDelete = staffPermissions.canDeleteOrder || staffPermissions.isAdmin

  const canRepair = areIn([order_status.AUTHORIZED]) && staffPermissions.isAdmin

  const canFinishRepair =
    areIn([order_status.REPAIRING]) && staffPermissions.isAdmin

  const COMMON_BUTTONS = [
    {
      label: 'Autorizar',
      show: canAuthorize,
      button: (
        <ButtonAuthorize
          orderId={orderId}
          isAuthorized={status === order_status.AUTHORIZED}
        />
      )
    },
    {
      label: 'Cancelar',
      show: canCancel,
      button: (
        <ButtonCancel
          orderId={orderId}
          isCancelled={status === order_status.CANCELLED}
        />
      )
    },
    {
      label: 'Editar',
      show: canEdit,
      button: (
        <Button
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Orders', {
              params: { orderId },
              screen: 'EditOrder'
            })
          }}
          label="Editar"
        />
      )
    },
    {
      label: 'Asignar',
      show: canAssign,
      button: (
        <ModalAssignOrder
          assignedToSection={order.assignToSection}
          assignToSection={(sectionId) => {
            ServiceOrders.update(orderId, { assignToSection: sectionId })
          }}
        />
      )
    },
    {
      label: 'Eliminar',
      show: canDelete,
      button: (
        <Button
          color="error"
          variant="outline"
          // disabled={disabledAssignButton}
          onPress={() => {
            ServiceOrders.delete(orderId).then((res) => {
              console.log('deleted', res)
              navigation.goBack()
            })
          }}
          label="Eliminar orden"
        />
      )
    }
  ]
  const RENT_BUTTONS = [
    {
      label: 'Entregar',
      show: canDelivery,
      button: <ButtonDelivery orderId={orderId} />
    },
    {
      label: 'Recoger',
      show: canPickup,
      button: <ButtonDelivery orderId={orderId} isDelivered />
    },

    {
      label: 'Regresar',
      show: canReturn,
      button: <ButtonDelivery orderId={orderId} cancelPickup />
    },
    {
      label: 'Renovar',
      show: canRenew,
      button: <ButtonRenew orderId={orderId} />
    }
  ]

  const REPAIR_BUTTONS = [
    //* REPAIRING
    {
      label: 'En reparacón',
      show: canRepair,
      button: <ButtonRepair orderId={orderId} />
    },
    //* REPAIRED
    {
      label: 'Terminar reparación',
      show: canFinishRepair,
      button: <ButtonRepaired orderId={orderId} />
    }

    //* SHOULD_DELIVER
  ]

  return (
    <View style={{ padding: 4 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: 200,
          width: '100%',
          margin: 'auto'
        }}
      >
        <OrderStatus orderId={orderId} />
      </View>
      <P bold>Acciones de orden</P>
      <View style={styles.container}>
        {COMMON_BUTTONS.map(
          ({ button, label, show }) =>
            show && (
              <View style={styles.item} key={label}>
                {button}
              </View>
            )
        )}
        {order.type === order_type.RENT &&
          RENT_BUTTONS.map(
            ({ button, label, show }) =>
              show && (
                <View style={styles.item} key={label}>
                  {button}
                </View>
              )
          )}
        {order.type === order_type.REPAIR &&
          REPAIR_BUTTONS.map(
            ({ button, label, show }) =>
              show && (
                <View style={styles.item} key={label}>
                  {button}
                </View>
              )
          )}
      </View>
    </View>
  )
}
const ButtonCancel = ({
  orderId,
  isCancelled,
  disabled
}: {
  orderId?: string
  isCancelled?: boolean
  disabled?: boolean
}) => {
  const { storeId } = useStore()
  const handleCancel = () => {
    ServiceOrders.update(orderId, {
      status: isCancelled ? order_status.PENDING : order_status.CANCELLED
    })
      .then(console.log)
      .catch(console.error)
    ServiceOrders.addComment({
      content: isCancelled ? 'Orden reanudada' : 'Orden cancelada',
      type: 'comment',
      orderId,
      storeId
    })
      .then(console.log)
      .catch(console.error)
  }
  return (
    <Button
      disabled={disabled}
      label={isCancelled ? 'Reanudar orden' : 'Cancelar orden'}
      onPress={() => {
        handleCancel()
      }}
    />
  )
}
const ButtonAuthorize = ({
  orderId,
  isAuthorized,
  disabled
}: {
  orderId: string
  isAuthorized: boolean
  disabled?: boolean
}) => {
  const { storeId } = useStore()
  const handleAuthorize = () => {
    ServiceOrders.update(orderId, {
      status: isAuthorized ? order_status.PENDING : order_status.AUTHORIZED
    })
      .then(console.log)
      .catch(console.error)

    ServiceOrders.addComment({
      content: isAuthorized ? 'Orden no autorizada' : 'Orden autorizada',
      type: 'comment',
      orderId,
      storeId
    })
      .then(console.log)
      .catch(console.error)
  }
  return (
    <Button
      variant="outline"
      disabled={disabled}
      label={isAuthorized ? 'No autorizar' : 'Autorizar'}
      onPress={() => {
        handleAuthorize()
      }}
    />
  )
}

const ButtonRenew = ({
  orderId,
  disabled
}: {
  orderId: string
  disabled?: boolean
}) => {
  const { navigate } = useNavigation()
  const handleRenew = async () => {
    // @ts-ignore
    navigate('RenewOrder', { orderId })
  }
  return (
    <Button
      disabled={disabled}
      label={'Renovar'}
      onPress={() => {
        handleRenew()
      }}
    />
  )
}
const ButtonDelivery = ({
  orderId,
  isDelivered,
  disabled,
  cancelPickup,
  isExpired
}: {
  orderId: string
  isDelivered?: boolean
  disabled?: boolean
  cancelPickup?: boolean
  isExpired?: boolean
}) => {
  const { storeId } = useStore()
  const { user } = useAuth()
  const handleDelivery = () => {
    if (cancelPickup) {
      ServiceOrders.update(orderId, {
        status: isDelivered ? order_status.PICKUP : order_status.DELIVERED
      })
        .then(console.log)
        .catch(console.error)
    } else {
      ServiceOrders.update(orderId, {
        status: isDelivered ? order_status.PICKUP : order_status.DELIVERED,
        deliveredAt: new Date(),
        deliveredBy: user?.id
      })
        .then(console.log)
        .catch(console.error)
    }
    ServiceOrders.addComment({
      storeId,
      orderId,
      type: 'comment',
      content: isDelivered ? 'Orden recogida' : 'Orden entregada'
    })
      .then(console.log)
      .catch(console.error)
    // orderId,
    // 'comment',
    // isDelivered ? 'Orden recogida' : 'Orden entregada'
  }
  return (
    <Button
      disabled={disabled}
      label={
        cancelPickup
          ? 'Regresar'
          : isDelivered || isExpired
          ? 'Recoger'
          : 'Entregar'
      }
      onPress={() => {
        handleDelivery()
      }}
    />
  )
}

const ButtonRepair = ({ orderId }: { orderId: string }) => {
  // const { navigate } = useNavigation()
  const handleRepair = () => {
    ServiceOrders.update(orderId, {
      status: order_status.REPAIRING
    })
      .then(console.log)
      .catch(console.error)
    // @ts-ignore
    // navigate('RepairOrder', { orderId })
  }
  return <Button label="En reparación" onPress={handleRepair} />
}

const ButtonRepaired = ({ orderId }: { orderId: string }) => {
  // const { navigate } = useNavigation()
  const { myStaffId } = useStore()
  const modal = useModal({ title: 'Detalles de reparación' })
  const [info, setInfo] = useState('')
  const [total, setTotal] = useState(0)
  const handleRepairFinished = async () => {
    await ServiceOrders.repaired(orderId, {
      info,
      total,
      repairedBy: myStaffId
    })
      .then(console.log)
      .catch(console.error)
    // @ts-ignore
    // navigate('RepairOrder', { orderId })
  }
  return (
    <>
      <Button label="Reparada" onPress={modal.toggleOpen} />
      <StyledModal {...modal}>
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
          <Button onPress={handleRepairFinished} color="success">
            Entregar
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

export default OrderActions
