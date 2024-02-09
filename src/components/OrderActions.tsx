import { StyleSheet, Text, View } from 'react-native'
import Button from './Button'
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderType, { order_status, order_type } from '../types/OrderType'
import OrderStatus from './OrderStatus'
import orderStatus from '../libs/orderStatus'
import { useNavigation } from '@react-navigation/native'
import { useStore } from '../contexts/storeContext'
import ModalAssignOrder from './OrderActions/ModalAssignOrder'

import ErrorBoundary from './ErrorBoundary'
import ButtonConfirm from './ButtonConfirm'
import { ServiceComments } from '../firebase/ServiceComments'
import OrderActionsRentFlow from './OrderActionsRentFlow'
import OrderActionsRepairFlow from './OrderActionsRepairFlow'
import { gStyles } from '../styles'

const OrderActions = ({ order }: { order: Partial<OrderType> }) => {
  const { staffPermissions } = useStore()
  const navigation = useNavigation()
  const status = orderStatus(order)
  const areIn = (statuses: order_status[]) => statuses.includes(status)
  const orderId = order?.id || ''

  const canCancel =
    areIn([
      order_status.PENDING,
      order_status.AUTHORIZED,
      order_status.CANCELLED
    ]) &&
    (staffPermissions.isAdmin || staffPermissions.canCancelOrder)

  const canAuthorize =
    areIn([order_status.PENDING]) &&
    (staffPermissions.canAuthorizeOrder || staffPermissions.isAdmin)

  const canAssign = staffPermissions.canAssignOrder || staffPermissions.isAdmin

  const canEdit = staffPermissions.canEditOrder || staffPermissions.isAdmin

  const canDelete = staffPermissions.canDeleteOrder || staffPermissions.isAdmin

  const COMMON_BUTTONS = [
    // {
    //   label: 'Autorizar',
    //   show: canAuthorize,
    //   button: (
    //     <ButtonAuthorize
    //       orderId={orderId}
    //       isAuthorized={status === order_status.AUTHORIZED}
    //     />
    //   )
    // },
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
      <Text style={[gStyles.h2, { marginVertical: 8, marginTop: 16 }]}>
        Acciones de orden
      </Text>
      {order.type === order_type.RENT && (
        <ErrorBoundary componentName="OrderActionsRentFlow">
          <OrderActionsRentFlow orderId={orderId} orderStatus={order.status} />
        </ErrorBoundary>
      )}
      {order.type === order_type.REPAIR && (
        <ErrorBoundary componentName="OrderActionsRepairFlow">
          <OrderActionsRepairFlow
            orderId={orderId}
            orderStatus={order.status}
          />
        </ErrorBoundary>
      )}
      <ErrorBoundary componentName="OrderActionsCommonButtons">
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
