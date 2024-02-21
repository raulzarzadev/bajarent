import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BalanceType } from '../types/BalanceType'
import DateCell from './DateCell'
import ErrorBoundary from './ErrorBoundary'
import { gStyles } from '../styles'
import PaymentsList from './PaymentsList'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import Button from './Button'
import CurrencyAmount from './CurrencyAmount'
import dictionary from '../dictionary'
import SpanUser from './SpanUser'
import SpanMetadata from './SpanMetadata'
export type BalanceInfoProps = { balance: BalanceType }
const BalanceInfoE = ({ balance }: BalanceInfoProps) => {
  const modalOrders = useModal({ title: 'Ordenes' })

  return (
    <View style={{ justifyContent: 'center' }}>
      <SpanMetadata {...balance} />
      <Text style={{ textAlign: 'center' }}>Corte</Text>
      <Text style={gStyles.h2}>{dictionary(balance?.type)} </Text>
      <Text style={gStyles.tCenter}>
        {balance?.type === 'partial' && <SpanUser userId={balance.userId} />}
      </Text>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          marginVertical: 8
        }}
      >
        <DateCell label="Desde" date={balance?.fromDate} />
        <Text> - </Text>
        <DateCell label="Hasta" date={balance?.toDate} />
      </View>
      <View>
        <Button
          label={`Pagos ${balance?.payments.length || 0}`}
          variant="ghost"
          onPress={modalOrders.toggleOpen}
        ></Button>
        <StyledModal {...modalOrders}>
          <PaymentsList payments={balance?.payments} />
        </StyledModal>
      </View>
      <View>
        <Text style={gStyles.h3}>Total</Text>
        <CurrencyAmount
          style={gStyles.h1}
          amount={balance?.payments?.reduce((acc, p) => acc + p.amount, 0)}
        />
      </View>
    </View>
  )
}

export default function BalanceInfo(props: BalanceInfoProps) {
  return (
    <ErrorBoundary componentName="BalanceInfo">
      <BalanceInfoE {...props} />
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({})
