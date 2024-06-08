import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import Button from './Button'
import InputTextStyled from './InputTextStyled'
import PaymentType, { PaymentBase, payment_methods } from '../types/PaymentType'
import InputRadios from './InputRadios'
import dictionary from '../dictionary'
import ErrorBoundary from './ErrorBoundary'
import { ServicePayments } from '../firebase/ServicePayments'
import FormPayment from './FormPayment'

export type ModalPaymentProps = {
  orderId: string
  paymentId?: string
  storeId: string
  defaultAmount?: number
}
export const ModalPayment = ({
  orderId,
  paymentId,
  storeId,
  defaultAmount = 0
}: ModalPaymentProps) => {
  const payment: PaymentBase = {
    amount: defaultAmount,
    reference: '',
    date: new Date(),
    method: 'cash',
    storeId,
    orderId
  }
  const label = 'Registrar pago'

  const modal = useModal({ title: label })

  const handleSavePayment = async ({ values }) => {
    console.log({ values })
    await ServicePayments.create({
      ...values
    })
      .then(console.log)
      .catch(console.error)
  }

  return (
    <>
      <Button
        onPress={modal.toggleOpen}
        icon="money"
        size="small"
        color="success"
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
