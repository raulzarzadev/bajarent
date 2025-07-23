import { StyleSheet } from 'react-native'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import Button from './Button'
import { PaymentBase } from '../types/PaymentType'
import ErrorBoundary from './ErrorBoundary'
import { ServicePayments } from '../firebase/ServicePayments'
import FormPayment from './FormPayment'
import { useCurrentWork } from '../state/features/currentWork/currentWorkSlice'

export type ModalPaymentProps = {
  orderId: string
  paymentId?: string
  storeId: string
  defaultAmount?: number
  orderSectionId: string
}
export const ModalPayment = ({
  orderId,
  paymentId,
  storeId,
  orderSectionId,
  defaultAmount = 0
}: ModalPaymentProps) => {
  const payment: PaymentBase = {
    amount: defaultAmount,
    reference: '',
    date: new Date(),
    method: 'transfer',
    storeId,
    orderId
  }
  const label = 'Registrar pago'

  const modal = useModal({ title: label })
  const { addWork } = useCurrentWork()
  const handleSavePayment = async ({ values }) => {
    const amount = parseFloat(values.amount || 0)
    await ServicePayments.orderPayment({
      ...values,
      amount
    })
      .then((res) => {
        const paymentId = res?.res?.id
        addWork({
          work: {
            action: 'payment_created',
            type: 'payment',
            details: {
              orderId,
              paymentId,
              sectionId: orderSectionId || null
            }
          }
        })
        console.log('Payment saved')
      })
      .catch(console.error)
  }

  return (
    <>
      <Button
        onPress={modal.toggleOpen}
        icon="add"
        size="small"
        color="success"
        variant="ghost"
        justIcon
      >
        {label}
      </Button>
      <StyledModal {...modal}>
        <FormPayment
          values={payment}
          onSubmit={async (values) => {
            modal.toggleOpen()
            try {
              return await handleSavePayment({ values })
            } catch (error) {
              console.error({ error })
            }
          }}
        />
      </StyledModal>
    </>
  )
}

export default (props: ModalPaymentProps) => {
  return (
    <ErrorBoundary componentName="ModalPayment">
      <ModalPayment {...props} />
    </ErrorBoundary>
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
