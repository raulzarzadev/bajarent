import ButtonConfirm from './ButtonConfirm'
import { OrderProvider, useOrderDetails } from '../contexts/orderContext'
import { ContactsList } from './OrderContacts'
import ErrorBoundary from './ErrorBoundary'
import Button from './Button'
import { View } from 'react-native'
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderChangeLabel from './OrderChangeLabel'
import TextInfo from './TextInfo'
import { CustomerCardE } from './Customers/CustomerCard'

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
        <QuickActions />
      </OrderProvider>
    </ButtonConfirm>
  )
}

const QuickActions = () => {
  const { order, customer } = useOrderDetails()
  const collectIt = order?.markedToCollect
  const chargeIt = order?.markedToCharge

  return (
    <View>
      <CustomerCardE customer={customer} />
      <TextInfo text="Etiquetas de color. Clasificalas y filtralas por color." />
      <OrderChangeLabel currentColor={order?.colorLabel} orderId={order?.id} />
      <TextInfo text="Acciones rápidas. Te ayudarán a saber las acciones pendientes de esta orden" />
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
          label={'Recoger'}
        />
        <Button
          variant={chargeIt ? 'filled' : 'ghost'}
          color="success"
          icon="chargeIt"
          onPress={() => {
            ServiceOrders.update(order.id, { markedToCharge: !chargeIt })
          }}
          label={'Cobrar'}
        />
      </View>
    </View>
  )
}

export const ModalOrderQuickActionsE = (props: ModalOrderQuickActionsProps) => (
  <ErrorBoundary componentName="ModalOrderQuickActions">
    <ModalOrderQuickActions {...props} />
  </ErrorBoundary>
)

export default ModalOrderQuickActions
