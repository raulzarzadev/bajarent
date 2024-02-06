import { StyleSheet, Text, View } from 'react-native'
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
import ErrorBoundary from './ErrorBoundary'
import ButtonConfirm from './ButtonConfirm'
import { ServiceComments } from '../firebase/ServiceComments'

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
    areIn([
      order_status.PENDING,
      order_status.AUTHORIZED,
      order_status.CANCELLED
    ]) &&
    (staffPermissions.isAdmin || staffPermissions.canCancelOrder)

  const canRenew =
    areIn([order_status.DELIVERED]) &&
    (staffPermissions.canRenewOrder || staffPermissions.isAdmin)

  const canAuthorize =
    areIn([order_status.PENDING]) &&
    (staffPermissions.canAuthorizeOrder || staffPermissions.isAdmin)
  const canPickup =
    areIn([order_status.DELIVERED, order_status.EXPIRED]) &&
    (staffPermissions.canPickupOrder || staffPermissions.isAdmin)

  const canReturn = areIn([order_status.PICKUP]) && staffPermissions.isAdmin

  const canAssign = staffPermissions.canAssignOrder || staffPermissions.isAdmin

  const canEdit = staffPermissions.canEditOrder || staffPermissions.isAdmin

  const canDelete = staffPermissions.canDeleteOrder || staffPermissions.isAdmin

  const canRepair =
    areIn([order_status.AUTHORIZED]) &&
    (staffPermissions.isAdmin || staffPermissions.canRepairOrder)

  const canFinishRepair =
    areIn([order_status.REPAIRING]) &&
    (staffPermissions.isAdmin || staffPermissions.canRepairOrder)

  const canDeliveryRepair =
    areIn([order_status.REPAIRED]) && staffPermissions.isAdmin

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
      label: 'Asignar',
      show: canAssign,
      button: (
        <ModalAssignOrder
          assignedToSection={order.assignToSection}
          assignedToStaff={order.assignToStaff}
          assignToStaff={(staffId) => {
            ServiceOrders.update(orderId, { assignToStaff: staffId })
          }}
          assignToSection={(sectionId) => {
            ServiceOrders.update(orderId, { assignToSection: sectionId })
          }}
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
      label: 'Eliminar',
      show: canDelete,
      button: (
        // <Button
        //   color="error"
        //   variant="outline"
        //   // disabled={disabledAssignButton}
        //   onPress={() => {
        //     ServiceOrders.delete(orderId).then((res) => {
        //       console.log('deleted', res)
        //       navigation.goBack()
        //     })
        //   }}
        //   label="Eliminar orden"
        // />
        <ButtonConfirm
          openLabel="Eliminar"
          openColor="error"
          openVariant="outline"
          confirmColor="error"
          confirmVariant="filled"
          confirmLabel="Eliminar "
          modalTitle="Eliminar orden"
          handleConfirm={async () => {
            ServiceOrders.delete(orderId)
              // .then((r) => console.log(r))
              .catch((e) => console.log(e))

            await ServiceComments.deleteOrderComments(orderId)
              // .then((r) => console.log(r))
              .catch((e) => console.log(e))

            navigation.goBack()
          }}
          text=" Se eliminara esta orden y todos sus comentarios !"
        ></ButtonConfirm>
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
      button: <ButtonPickup orderId={orderId} />
    },
    {
      label: 'Regresar',
      show: canReturn,
      button: <ButtonCancelDelivery orderId={orderId} />
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
    },

    //* SHOULD_DELIVER

    {
      label: 'Entregar',
      show: canDeliveryRepair,
      button: <ButtonDeliveryRepair orderId={orderId} />
    }
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
      <ErrorBoundary componentName="OrderActionsButtons">
        <View style={styles.container}>
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
        <View style={styles.container}>
          {COMMON_BUTTONS.map(
            ({ button, label, show }) =>
              show && (
                <View style={styles.item} key={label}>
                  {button}
                </View>
              )
          )}
        </View>
      </ErrorBoundary>
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

const ButtonPickup = ({ orderId }: { orderId: string }) => {
  const { storeId, myStaffId } = useStore()
  const handlePickup = () => {
    ServiceOrders.update(orderId, {
      status: order_status.PICKUP,
      pickedUpAt: new Date(),
      pickedUpBy: myStaffId
    })
      .then(console.log)
      .catch(console.error)
    ServiceOrders.addComment({
      storeId,
      orderId,
      type: 'comment',
      content: 'Orden recogida'
    })
      .then(console.log)
      .catch(console.error)
  }
  return (
    <Button
      color="success"
      label={'Recoger'}
      onPress={() => {
        handlePickup()
      }}
    />
  )
}

const ButtonCancelDelivery = ({ orderId }: { orderId: string }) => {
  const { storeId } = useStore()
  const handleDelivery = () => {
    ServiceOrders.update(orderId, {
      status: order_status.DELIVERED
    })
      .then(console.log)
      .catch(console.error)
    ServiceOrders.addComment({
      storeId,
      orderId,
      type: 'comment',
      content: 'Orden regresada'
    })
      .then(console.log)
      .catch(console.error)
  }
  return (
    <Button
      variant="outline"
      label={'Regresar'}
      onPress={() => {
        handleDelivery()
      }}
    />
  )
}

const ButtonDeliveryRepair = ({ orderId }: { orderId: string }) => {
  const { storeId, myStaffId } = useStore()
  const { user } = useAuth()
  const handleDelivery = () => {
    ServiceOrders.update(orderId, {
      status: order_status.REPAIR_DELIVERED,
      deliveredAt: new Date(),
      deliveredBy: user?.id,
      deliveredByStaff: myStaffId
    })
      .then(console.log)
      .catch(console.error)
    ServiceOrders.addComment({
      storeId,
      orderId,
      type: 'comment',
      content: 'Reparación entregada'
    })
      .then(console.log)
      .catch(console.error)
  }
  return (
    <Button
      color="success"
      label={'Entregar'}
      onPress={() => {
        handleDelivery()
      }}
    />
  )
}
const ButtonDelivery = ({ orderId }: { orderId: string }) => {
  const { storeId, myStaffId } = useStore()
  const { user } = useAuth()
  const handleDelivery = () => {
    ServiceOrders.update(orderId, {
      status: order_status.DELIVERED,
      deliveredAt: new Date(),
      deliveredBy: user?.id,
      deliveredByStaff: myStaffId
    })
      .then(console.log)
      .catch(console.error)
    ServiceOrders.addComment({
      storeId,
      orderId,
      type: 'comment',
      content: 'Orden entregada'
    })
      .then(console.log)
      .catch(console.error)
  }
  return (
    <Button
      color="success"
      label={'Entregar'}
      onPress={() => {
        handleDelivery()
      }}
    />
  )
}

const ButtonRepair = ({ orderId }: { orderId: string }) => {
  const { storeId } = useStore()
  const handleRepair = () => {
    ServiceOrders.update(orderId, {
      status: order_status.REPAIRING
    })
      .then(console.log)
      .catch(console.error)
    ServiceOrders.addComment({
      storeId,
      orderId,
      type: 'comment',
      content: 'Orden en reparación'
    })
      .then(console.log)
      .catch(console.error)
    // @ts-ignore
    // navigate('RepairOrder', { orderId })
  }
  return <Button label="En reparación" onPress={handleRepair} color="success" />
}

const ButtonRepaired = ({ orderId }: { orderId: string }) => {
  const { user } = useAuth()
  const { myStaffId, storeId } = useStore()
  const modal = useModal({ title: 'Detalles de reparación' })
  const [info, setInfo] = useState('')
  const [total, setTotal] = useState(0)
  const handleRepairFinished = async () => {
    await ServiceOrders.repaired(orderId, {
      info,
      total,
      repairedBy: user.id,
      repairedByStaff: myStaffId
    })
      .then(console.log)
      .catch(console.error)
    ServiceOrders.addComment({
      storeId,
      orderId,
      type: 'comment',
      content: 'Reparación terminada'
    })
      .then(console.log)
      .catch(console.error)
    // @ts-ignore
    // navigate('RepairOrder', { orderId })
  }
  return (
    <>
      <Button label="Reparada" onPress={modal.toggleOpen} color="success" />
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
