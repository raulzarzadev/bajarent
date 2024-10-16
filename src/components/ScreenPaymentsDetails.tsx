import { ScrollView, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useStore } from '../contexts/storeContext'
import CurrencyAmount from './CurrencyAmount'
import { gStyles } from '../styles'
import dictionary from '../dictionary'
import ErrorBoundary from './ErrorBoundary'
import ButtonConfirm from './ButtonConfirm'
import { ServicePayments } from '../firebase/ServicePayments'
import InputTextStyled from './InputTextStyled'
import { useAuth } from '../contexts/authContext'
import SpanUser from './SpanUser'
import asDate, { dateFormat, fromNow } from '../libs/utils-date'
import { colors } from '../theme'
import Loading from './Loading'
import Button from './Button'
import { useEmployee } from '../contexts/employeeContext'
import PaymentType from '../types/PaymentType'
import SpanMetadata from './SpanMetadata'
import PaymentVerify from './PaymentVerify'
import ImagePreview from './ImagePreview'
import TextInfo from './TextInfo'

const CANCELED_REASON_MIN_LENGTH = 10
const ScreenPaymentsDetails = ({ route, navigation }) => {
  const { id } = route.params
  const { staff } = useStore()
  const { permissions } = useEmployee()
  const canCancelPayments = permissions?.canCancelPayments
  const [payment, setPayment] = useState<PaymentType>()
  useEffect(() => {
    handleGetPayment()
  }, [id])
  const { user } = useAuth()

  const handleGetPayment = () => {
    ServicePayments.get(id).then((res) => setPayment(res))
  }

  const [reason, setReason] = useState('')
  const isCanceled = payment?.canceled

  if (!payment) return <Loading />

  return (
    <ScrollView>
      <View style={gStyles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16
          }}
        >
          <SpanMetadata
            createdAt={payment.createdAt}
            createdBy={payment.createdBy}
            id={payment.id}
            orderId={payment.orderId}
          />
        </View>
        <View style={{ justifyContent: 'center', margin: 'auto' }}>
          <ImagePreview
            image={payment?.image}
            title="Comprobante"
            fullscreen
            height={40}
            width={40}
          />
        </View>
        <CurrencyAmount style={gStyles.h1} amount={payment?.amount} />

        {!!payment?.method && (
          <Text
            style={{
              textAlign: 'center',
              marginVertical: 8,
              textTransform: 'capitalize'
            }}
          >
            {dictionary(payment?.method)}
          </Text>
        )}
        <Text style={[gStyles.helper, { textAlign: 'center' }]}>
          Referencia:
        </Text>
        {!!payment?.reference && (
          <Text style={[{ textAlign: 'center', marginBottom: 8 }, gStyles.h3]}>
            {payment?.reference}{' '}
            {dateFormat(asDate(payment.date), 'dd/MMM/yy HH:MM')}
          </Text>
        )}
        <View style={{ marginVertical: 12 }}>
          <PaymentVerify
            payment={payment}
            showData
            onVerified={handleGetPayment}
          />
        </View>

        <Button
          variant="ghost"
          onPress={() => {
            navigation.navigate('StackOrders', {
              screen: 'OrderDetails',
              params: { orderId: payment?.orderId }
            })
          }}
          label="Ver orden"
        />
        {isCanceled && (
          <View
            style={{
              borderColor: colors.red,
              borderWidth: 1,
              borderRadius: 8,
              marginVertical: 8
            }}
          >
            <Text
              style={{ color: 'red', textAlign: 'center', marginVertical: 8 }}
            >
              Este pago ha sido cancelado
            </Text>
            <Text style={{ textAlign: 'center' }}>
              Fecha: {dateFormat(payment?.canceledAt, 'dd MMM yy HH:mm')}{' '}
              {fromNow(payment?.canceledAt)}
            </Text>
            <Text style={{ textAlign: 'center' }}>
              Motivo: {payment?.canceledReason}
            </Text>
            <Text style={{ textAlign: 'center' }}>
              Autor: <SpanUser userId={payment.canceledBy} />
            </Text>
          </View>
        )}
        {canCancelPayments && (
          <ButtonConfirm
            openDisabled={isCanceled}
            openLabel="Cancelar pago"
            modalTitle="Cancelar pago"
            openColor="error"
            icon={'cancel'}
            openVariant="outline"
            confirmLabel="Cancelar"
            confirmColor="error"
            text="¿Estás seguro de que deseas cancelar este pago?"
            handleConfirm={async () => {
              return ServicePayments.update(payment?.id, {
                canceled: true,
                canceledReason: reason,
                canceledAt: new Date(),
                canceledBy: user?.id
              }).then(() => {
                navigation.goBack()
              })
            }}
          >
            <TextInfo
              defaultVisible
              text="¿Estás seguro de que deseas cancelar este pago?"
            ></TextInfo>
            <View style={{ marginVertical: 8 }}>
              <InputTextStyled
                label="Motivo de cancelación"
                placeholder="Escribe el motivo de cancelación"
                onChangeText={(value) => {
                  setReason(value)
                }}
                helperTextColor={
                  reason.length < CANCELED_REASON_MIN_LENGTH ? 'error' : 'black'
                }
                helperText={`${
                  reason.length < CANCELED_REASON_MIN_LENGTH
                    ? 'Mínimo 10 caracteres'
                    : ''
                }`}
                value={reason}
              />
            </View>
          </ButtonConfirm>
        )}
      </View>
    </ScrollView>
  )
}

export default function (props) {
  return (
    <ErrorBoundary>
      <ScreenPaymentsDetails {...props} />
    </ErrorBoundary>
  )
}
