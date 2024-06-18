import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PaymentType from '../types/PaymentType'
import SpanMetadata from './SpanMetadata'
import ButtonConfirm from './ButtonConfirm'
import { ServicePayments } from '../firebase/ServicePayments'
import { useAuth } from '../contexts/authContext'
import { useEmployee } from '../contexts/employeeContext'

const PaymentVerify = ({
  payment,
  showData,
  onVerified,
  disabled
}: {
  payment: PaymentType
  showData?: boolean
  onVerified?: () => void
  disabled?: boolean
}) => {
  const {
    permissions: { canValidatePayments }
  } = useEmployee()
  const paymentId = payment?.id
  const isVerified = payment?.verified
  const verifiedBy = payment?.verifiedBy
  const verifiedAt = payment?.verifiedAt

  const { user } = useAuth()

  const handleVerifyPayment = async (paymentId) => {
    await ServicePayments.update(paymentId, {
      verified: !isVerified,
      verifiedAt: new Date(),
      verifiedBy: user.id
    })
      .then(console.log)
      .catch(console.error)
      .finally(() => {
        onVerified?.()
      })
  }

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {showData && <Text style={{ marginRight: 8 }}>¿Pago verificado?</Text>}
        {isVerified ? (
          <ButtonConfirm
            openDisabled={!canValidatePayments}
            openSize="xs"
            modalTitle="Invalidar pago"
            openVariant="filled"
            openColor="success"
            icon="done"
            justIcon
            text="¿Invalidar pago?"
            handleConfirm={async () => {
              return await handleVerifyPayment(paymentId)
            }}
            confirmVariant="ghost"
            confirmColor="error"
            confirmLabel="Invalidar"
          />
        ) : (
          <ButtonConfirm
            openDisabled={!canValidatePayments}
            openSize="xs"
            modalTitle="Verifcar pago"
            openVariant="ghost"
            openColor="neutral"
            icon="done"
            justIcon
            text="¿El pago es correcto?"
            handleConfirm={async () => {
              return await handleVerifyPayment(paymentId)
            }}
            confirmColor="success"
            confirmLabel="Verificar"
          />
        )}
      </View>
      {!!showData && (
        <View>
          {!!verifiedAt && (
            <SpanMetadata
              layout="column"
              createdAt={verifiedAt}
              createdBy={verifiedBy}
            />
          )}
        </View>
      )}
    </View>
  )
}

export default PaymentVerify

const styles = StyleSheet.create({})
