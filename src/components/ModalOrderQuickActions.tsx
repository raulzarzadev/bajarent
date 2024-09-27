import ButtonConfirm from './ButtonConfirm'
import { OrderProvider, useOrderDetails } from '../contexts/orderContext'
import { ContactsList } from './OrderContacts'
import ErrorBoundary from './ErrorBoundary'
import Button from './Button'
import { View } from 'react-native'
import { ServiceOrders } from '../firebase/ServiceOrders'

type ModalOrderQuickActionsProps = {
  orderId: string
}
const ModalOrderQuickActions = ({ orderId }: ModalOrderQuickActionsProps) => {
  return (
    <ButtonConfirm
      modalTitle="Acciones "
      justIcon
      openSize="xs"
      icon="verticalDots"
      openVariant="ghost"
      hideConfirm
    >
      <OrderProvider orderId={orderId}>
        <ContactsList />
        <QuickActions />
      </OrderProvider>
    </ButtonConfirm>
  )
}

const QuickActions = () => {
  const { order } = useOrderDetails()
  const collectIt = order?.markedToCollect
  const chargeIt = order?.markedToCharge
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10
      }}
    >
      <Button
        variant={collectIt ? 'filled' : 'ghost'}
        icon="pickUpIt"
        color="secondary"
        onPress={() => {
          ServiceOrders.update(order.id, { markedToCollect: !collectIt })
        }}
        label={collectIt ? 'Marcada para recoger' : 'Marcar para recoger'}
      />
      <Button
        variant={chargeIt ? 'filled' : 'ghost'}
        color="success"
        icon="chargeIt"
        onPress={() => {
          ServiceOrders.update(order.id, { markedToCharge: !chargeIt })
        }}
        label={chargeIt ? 'Pasar a cobrar' : 'Marcar para cobrar'}
      />
    </View>
  )
}

export const ModalOrderQuickActionsE = (props: ModalOrderQuickActionsProps) => (
  <ErrorBoundary componentName="ModalOrderQuickActions">
    <ModalOrderQuickActions {...props} />
  </ErrorBoundary>
)

export default ModalOrderQuickActions
