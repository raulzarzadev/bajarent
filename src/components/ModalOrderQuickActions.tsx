import ButtonConfirm from './ButtonConfirm'
import { OrderProvider } from '../contexts/orderContext'
import { ContactsList } from './OrderContacts'
import ErrorBoundary from './ErrorBoundary'

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
      </OrderProvider>
    </ButtonConfirm>
  )
}

export const ModalOrderQuickActionsE = (props: ModalOrderQuickActionsProps) => (
  <ErrorBoundary componentName="ModalOrderQuickActions">
    <ModalOrderQuickActions {...props} />
  </ErrorBoundary>
)

export default ModalOrderQuickActions
