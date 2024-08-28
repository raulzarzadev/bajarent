import { ScrollView, StyleSheet, Text, View } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import Button, { ButtonProps } from '../Button'
import { useOrderDetails } from '../../contexts/orderContext'
import OrderType, { order_status, order_type } from '../../types/OrderType'
import useModal from '../../hooks/useModal'

import ModalRentStart from './ModalRentStart'
import ModalRentFinish from './ModalRentFinish'
import { gSpace, gStyles } from '../../styles'
import {
  onAuthorize,
  onComment,
  onRepairDelivery,
  onRepairFinish
} from '../../libs/order-actions'
import { useAuth } from '../../contexts/authContext'
import { useEffect, useState } from 'react'
import ModalStartRepair from './ModalRepairStart'
import { ServiceStoreItems } from '../../firebase/ServiceStoreItems'
import ButtonConfirm from '../ButtonConfirm'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import { useEmployee } from '../../contexts/employeeContext'
import { ItemStatuses } from '../../types/ItemType'
import { ServiceItemHistory } from '../../firebase/ServiceItemHistory'
import { onRegistryEntry } from '../../firebase/actions/item-actions'

//* repaired
function OrderActions() {
  const { order } = useOrderDetails()
  const orderType = order?.type
  return (
    <View style={{ marginBottom: gSpace(4) }}>
      {orderType === order_type.REPAIR && <RepairOrderActions order={order} />}
      {orderType === order_type.RENT && <RentOrderActions order={order} />}
    </View>
  )
}

export default OrderActions
export const OrderActionsE = (props) => (
  <ErrorBoundary componentName="OrderActions">
    <OrderActions {...props} />
  </ErrorBoundary>
)

const RepairOrderActions = ({ order }: { order: OrderType }) => {
  const { user } = useAuth()

  const status = order?.status
  const isDelivered = status === order_status.DELIVERED
  const isRepaired = status === order_status.REPAIRED
  const isRepairing = status === order_status.REPAIRING
  const isAuthorized = status === order_status.AUTHORIZED
  const modalRepairStart = useModal({ title: 'Comenzar reparación' })

  return (
    <ScrollView horizontal style={styles.scrollView}>
      <ModalStartRepair modal={modalRepairStart} />
      <View style={styles.container}>
        <ButtonAction
          isSelected={isAuthorized}
          selectedLabel="Pedido"
          unselectedLabel="Pedido"
          color="success"
          onPress={async () => {
            await onAuthorize({ orderId: order.id, userId: user.id }).catch(
              console.error
            )
          }}
        />
        <ButtonAction
          isSelected={isRepairing}
          selectedLabel="Reparando"
          unselectedLabel="Iniciar"
          onPress={() => {
            modalRepairStart.toggleOpen()
          }}
        />

        <ButtonAction
          isSelected={isRepaired}
          selectedLabel="Reprada "
          unselectedLabel="Terminar "
          onPress={async () => {
            await onRepairFinish({
              orderId: order.id,
              userId: user.id
            }).catch(console.error)
          }}
        />
        <ButtonAction
          isSelected={isDelivered}
          selectedLabel="Entregado "
          unselectedLabel="Entregar "
          onPress={async () => {
            await onRepairDelivery({
              orderId: order.id,
              userId: user.id
            }).catch(console.error)
          }}
        />
      </View>
    </ScrollView>
  )
}

const RentOrderActions = ({ order }: { order: OrderType }) => {
  const status = order?.status
  const isDelivered = status === order_status.DELIVERED

  const isPending =
    status === order_status.AUTHORIZED || status === order_status.PENDING
  const isPickedUp = status === order_status.PICKED_UP
  const { permissions } = useEmployee()
  useEffect(() => {
    checkIfAllItemsExists()
  }, [order.items])

  const [allItemsExists, setAllItemsExists] = useState(false)

  const checkIfAllItemsExists = async () => {
    const promises =
      order?.items?.map((item) => {
        return ServiceStoreItems.get({
          itemId: item.id,
          storeId: order.storeId
        })
      }) || []
    const res = await Promise.all(promises)
    if (res.every((r) => r)) return setAllItemsExists(true)
    setAllItemsExists(false)
  }

  const canCancelPickUp = permissions?.canCancelPickedUp

  const modalRentStart = useModal({ title: 'Comenzar renta' })
  const modalRentFinish = useModal({ title: 'Terminar renta' })
  return (
    <>
      {!allItemsExists && (
        <Text style={[gStyles.tError, gStyles.tCenter]}>
          *Algun artículo no existe
        </Text>
      )}
      <ScrollView horizontal style={styles.scrollView}>
        <ModalRentStart modal={modalRentStart} />
        <ModalRentFinish modal={modalRentFinish} />
        <View style={styles.container}>
          {isDelivered && canCancelPickUp && (
            <View style={{ marginVertical: 'auto' }}>
              <ButtonConfirm
                openLabel="Pedido "
                confirmColor="warning"
                confirmVariant="outline"
                confirmLabel="Cancelar entrega"
                icon="undo"
                openColor="warning"
                openVariant="outline"
                openSize="small"
                text="¿Estás seguro de que quieres cancelar entrega?"
                handleConfirm={async () => {
                  //* UPDATE ORDER
                  ServiceOrders.update(order.id, {
                    status: order_status.AUTHORIZED,
                    deliveredAt: null,
                    deliveredBy: null
                  })
                    .then((r) => console.log(r))
                    .catch((e) => console.log(e)) //* COMMENT ORDER
                  onComment({
                    content: 'Entrega cancelada',
                    orderId: order.id,
                    storeId: order.storeId,
                    type: 'comment',
                    isOrderMovement: true
                  })
                    .then((r) => console.log(r))
                    .catch((e) => console.log(e))
                  order?.items?.forEach((item) => {
                    //* UPDATE ITEM AND CREATE HISTORY ENTRY
                    ServiceStoreItems.update({
                      itemId: item.id,
                      storeId: order.storeId,
                      itemData: { status: ItemStatuses.pickedUp }
                    })
                      .then((r) => console.log(r))
                      .catch((e) => console.log(e))
                    onRegistryEntry({
                      itemId: item.id,
                      storeId: order.storeId,
                      type: 'pickup',
                      orderId: order.id,
                      content: 'Entrega cancelada'
                    })
                      .then((r) => console.log(r))
                      .catch((e) => console.log(e))
                  })
                }}
              />
            </View>
          )}

          {isPickedUp && canCancelPickUp && (
            <View style={{ marginVertical: 'auto' }}>
              <ButtonConfirm
                openLabel="Regresar "
                confirmColor="error"
                confirmVariant="outline"
                confirmLabel="Cancelar recolección"
                icon="undo"
                openColor="error"
                openVariant="outline"
                openSize="small"
                text="¿Estás seguro de que quieres cancelar la recolección?"
                handleConfirm={async () => {
                  //* UPDATE ORDER
                  ServiceOrders.update(order.id, {
                    status: order_status.DELIVERED,
                    pickedUpAt: null,
                    pickedUpBy: null
                  })
                    .then((r) => console.log(r))
                    .catch((e) => console.log(e)) //* COMMENT ORDER
                  onComment({
                    content: 'Recolección cancelada',
                    orderId: order.id,
                    storeId: order.storeId,
                    type: 'comment',
                    isOrderMovement: true
                  })
                    .then((r) => console.log(r))
                    .catch((e) => console.log(e))
                  order?.items?.forEach((item) => {
                    //* UPDATE ITEM AND CREATE HISTORY ENTRY
                    ServiceStoreItems.update({
                      itemId: item.id,
                      storeId: order.storeId,
                      itemData: { status: ItemStatuses.rented }
                    })
                      .then((r) => console.log(r))
                      .catch((e) => console.log(e))
                    onRegistryEntry({
                      itemId: item.id,
                      storeId: order.storeId,
                      type: 'delivery',
                      orderId: order.id,
                      content: 'Recolección cancelada'
                    })
                      .then((r) => console.log(r))
                      .catch((e) => console.log(e))
                  })
                }}
              />
            </View>
          )}
          <ButtonAction
            isSelected={isDelivered}
            selectedLabel="Entregado"
            unselectedLabel="Entregar"
            onPress={() => {
              modalRentStart.toggleOpen()
            }}
            disabled={isPickedUp}
          />
          <ButtonAction
            disabled={isPending || !allItemsExists}
            isSelected={isPickedUp}
            selectedLabel="Recogido"
            unselectedLabel="Recoger"
            onPress={() => {
              modalRentFinish.toggleOpen()
            }}
          />
        </View>
      </ScrollView>
    </>
  )
}

const ButtonAction = ({
  selectedLabel,
  unselectedLabel,
  isSelected,
  disabled,
  color,
  onPress
}: {
  selectedLabel: string
  unselectedLabel: string
  isSelected: boolean
  disabled?: boolean
  onPress: () => void
  color?: ButtonProps['color']
}) => {
  return (
    <Button
      variant={isSelected ? 'filled' : 'outline'}
      disabled={isSelected || disabled}
      label={isSelected ? selectedLabel : unselectedLabel}
      onPress={() => {
        onPress()
      }}
      color={color}
      buttonStyles={styles.button}
    ></Button>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    maxWidth: '100%',
    marginHorizontal: 'auto'
  },
  container: {
    flexDirection: 'row'
  },
  button: {
    margin: 4,
    width: 100
  }
})
