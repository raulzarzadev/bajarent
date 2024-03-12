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
import { useState } from 'react'
import ModalSendWhatsapp from './ModalSendWhatsapp'
import dictionary from '../dictionary'
import { dateFormat } from '../libs/utils-date'

const OrderActions = ({ order }: { order: Partial<OrderType> }) => {
  const { staffPermissions, store } = useStore()
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
    (staffPermissions?.isAdmin || staffPermissions?.canCancelOrder)

  // const canAuthorize =
  //   areIn([order_status.PENDING]) &&
  //   (staffPermissions?.canAuthorizeOrder || staffPermissions?.isAdmin)

  const canAssign =
    staffPermissions?.canAssignOrder || staffPermissions?.isAdmin

  const canEdit = staffPermissions?.canEditOrder || staffPermissions?.isAdmin

  const canDelete =
    staffPermissions?.canDeleteOrder || staffPermissions?.isAdmin

  const orderPeriod = (order: Partial<OrderType>): string => {
    const res = ''
    //* if is rent should return the period
    if (
      order.type === order_type.RENT ||
      order.type === order_type.STORE_RENT
    ) {
      return `Periodo:  ${dateFormat(
        order.deliveredAt,
        'dd/MM/yy'
      )} al ${dateFormat(order.expireAt, 'dd/MM/yy')}`
    }

    console.log({ order })
    if (order.type === order_type.REPAIR) {
      return `
      Marca: ${order.itemBrand || ''}
      Serie: ${order.itemSerial || ''}
      Problema: ${order.description || ''}

      ${
        order.repairInfo
          ? `
      ${order.repairInfo || ''}
      $${order.repairTotal || 0}
      `
          : ''
      }`
    }
    return res
  }
  const orderPayments = () => {
    let res = ''
    if (order.payments.length > 0) {
      res += `
      *Pagos:* \n`
      order.payments.forEach((p) => {
        res += `${new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN'
        }).format(p.amount)} ${dictionary(p.method)} ${dateFormat(
          p.createdAt,
          'dd/MMM/yy HH:mm'
        )} \n`
      })
    }
    return res
  }
  const orderStatusMessage = `
Tienda: *${store.name}*
Order: *${order.folio}*
Tipo: ${dictionary(order.type)}
Status: ${dictionary(status)}
Reportes activos: ${order.hasNotSolvedReports ? '*Si*' : 'No'}
${orderPeriod(order)}
${orderPayments()}
 `
  const COMMON_BUTTONS = [
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
    },
    {
      label: 'Enviar Whatsapp',
      show: true,
      button: (
        <ModalSendWhatsapp to={order?.phone} message={orderStatusMessage} />
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

      <PriorityOrder orderId={orderId} />

      {(order.type === order_type.RENT ||
        order.type === order_type.STORE_RENT) && (
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

const PriorityOrder = ({ orderId }) => {
  const { orders } = useStore()
  const order = orders.find((o) => o.id === orderId)
  const orderPriority = order?.priority
  const [priority, setPriority] = useState(orderPriority || 0)
  const [disabled, setDisabled] = useState(false)

  const handleSetPriority = async (amount: number) => {
    setDisabled(true)
    setPriority(priority + amount)
    await updatePriority(orderId, priority + amount)
    setTimeout(() => {
      setDisabled(false)
    }, 600)
  }

  const updatePriority = async (orderId: string, value: number) => {
    await ServiceOrders.update(orderId, { priority: value })
      .then((r) => console.log(r))
      .catch((e) => console.error(e))
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text style={gStyles.h2}>Prioridad:</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {!!priority && (
          <Button
            disabled={disabled}
            variant="ghost"
            icon="sub"
            justIcon
            onPress={() => handleSetPriority(-1)}
          ></Button>
        )}
        {!priority && <Text style={{ marginLeft: 8 }}>Sin prioridad </Text>}
        {!!priority && <Text style={gStyles.h2}>{priority}</Text>}
        <Button
          disabled={disabled}
          variant="ghost"
          icon="add"
          justIcon
          onPress={() => handleSetPriority(1)}
        ></Button>
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
