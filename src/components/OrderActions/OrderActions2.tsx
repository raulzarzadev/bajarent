import { ScrollView, StyleSheet, Text, View } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import Button, { ButtonProps } from '../Button'
import { useOrderDetails } from '../../contexts/orderContext'
import OrderType, { order_status, order_type } from '../../types/OrderType'
import useModal from '../../hooks/useModal'

import ModalRentStart from './ModalRentStart'
import ModalRentFinish from './ModalRentFinish'
import { gSpace, gStyles } from '../../styles'
import { useStore } from '../../contexts/storeContext'
import {
  onAuthorize,
  onRepairDelivery,
  onRepairFinish,
  onRepairStart
} from '../../libs/order-actions'
import { useAuth } from '../../contexts/authContext'
import { useEffect, useState } from 'react'
import ModalStartRepair from './ModalRepairStart'
import { ServiceStoreItems } from '../../firebase/ServiceStoreItems'

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

  useEffect(() => {
    checkIfAllItemsExists()
  }, [order.items])

  const [allItemsExists, setAllItemsExists] = useState(false)

  const checkIfAllItemsExists = async () => {
    const promises = order?.items.map((item) => {
      return ServiceStoreItems.get({ itemId: item.id, storeId: order.storeId })
    })
    const res = await Promise.all(promises)
    if (res.every((r) => r)) return setAllItemsExists(true)
    setAllItemsExists(false)
  }

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
          <ButtonAction
            isSelected={isDelivered}
            selectedLabel="Entregado"
            unselectedLabel="Entregar"
            onPress={() => {
              modalRentStart.toggleOpen()
            }}
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
