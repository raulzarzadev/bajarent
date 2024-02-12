import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import Button from './Button'
import InputTextStyled from './InputTextStyled'
import PaymentType, { PaymentBase, PaymentMethods } from '../types/PaymentType'
import InputRadios from './InputRadios'
import dictionary from '../dictionary'
import ErrorBoundary from './ErrorBoundary'

export type ModalPaymentProps = {
  orderId: string
  paymentId?: string
  storeId: string
}
export const ModalPayment = ({
  orderId,
  paymentId,
  storeId
}: ModalPaymentProps) => {
  const payment: PaymentBase = {
    amount: 0,
    date: new Date(),
    method: 'cash',
    storeId,
    orderId
  }
  const label = 'Pagar'

  const modal = useModal({ title: label })

  const [method, setMethod] = useState<PaymentType['method']>(
    payment?.method || 'cash'
  )

  const [amount, setAmount] = useState(payment?.amount || 0)
  const [saving, setSaving] = useState(false)

  const handleSavePayment = async () => {
    setSaving(true)
    console.log({ amount, method })
    resetForm()
  }

  const resetForm = () => {
    modal.toggleOpen()
    setSaving(false)
    setAmount(0)
    setMethod('cash')
  }

  const methods = Object.values(PaymentMethods).map((method) => ({
    label: dictionary(method),
    value: method
  }))

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
        <View style={styles.repairItemForm}>
          <InputRadios
            layout="row"
            value={method}
            options={methods}
            setValue={(value) => {
              setMethod(value as PaymentType['method'])
            }}
          />
        </View>
        <View style={styles.repairItemForm}>
          <InputTextStyled
            type="number"
            value={amount}
            keyboardType="numeric"
            placeholder="Total $ "
            onChangeText={(value) => {
              setAmount(parseFloat(value) || 0)
            }}
          ></InputTextStyled>
        </View>
        <View style={styles.repairItemForm}>
          <Button disabled={saving} onPress={handleSavePayment} color="success">
            {payment ? 'Guardar' : 'Editar'}
          </Button>
        </View>
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
