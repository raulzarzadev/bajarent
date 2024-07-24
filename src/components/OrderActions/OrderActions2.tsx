import { ScrollView, StyleSheet, Text, View } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import Button from '../Button'
import { useOrderDetails } from '../../contexts/orderContext'
import OrderType, { order_status, order_type } from '../../types/OrderType'
import useModal from '../../hooks/useModal'
import ModalStartRepair from './ModalRepairStart'
import ModalRepairFinish from './ModalRepairFinish'
import ModalRepairDelivery from './ModalRepairDelivery'
import ModalRentStart from './ModalRentStart'
import ModalRentFinish from './ModalRentFinish'
import { gSpace, gStyles } from '../../styles'
import { useStore } from '../../contexts/storeContext'

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
  const status = order?.status
  const isDelivered = status === order_status.DELIVERED
  const isRepaired = status === order_status.REPAIRED
  const isRepairing = status === order_status.REPAIRING
  const modalRepairStart = useModal({ title: 'Comenzar reparación' })
  const modalRepairFinish = useModal({ title: 'Terminar reparación' })
  const modalRepairDelivery = useModal({ title: 'Entregar reparación' })
  return (
    <ScrollView horizontal style={styles.scrollView}>
      <ModalStartRepair modal={modalRepairStart} />
      <ModalRepairFinish modal={modalRepairFinish} />
      <ModalRepairDelivery modal={modalRepairDelivery} />
      <View style={styles.container}>
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
          onPress={() => {
            modalRepairFinish.toggleOpen()
          }}
        />
        <ButtonAction
          isSelected={isDelivered}
          selectedLabel="Entregado "
          unselectedLabel="Entregar "
          onPress={() => {
            modalRepairDelivery.toggleOpen()
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
  const { items } = useStore()

  const itemsAlreadyExists = order?.items?.every((item) =>
    items?.find((i) => i?.id === item?.id)
  )

  const modalRentStart = useModal({ title: 'Comenzar renta' })
  const modalRentFinish = useModal({ title: 'Terminar renta' })
  return (
    <>
      {!itemsAlreadyExists && (
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
            disabled={isPending || !itemsAlreadyExists}
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
  onPress
}: {
  selectedLabel: string
  unselectedLabel: string
  isSelected: boolean
  disabled?: boolean
  onPress: () => void
}) => {
  return (
    <Button
      variant={isSelected ? 'filled' : 'outline'}
      disabled={isSelected || disabled}
      label={isSelected ? selectedLabel : unselectedLabel}
      onPress={() => {
        onPress()
      }}
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
