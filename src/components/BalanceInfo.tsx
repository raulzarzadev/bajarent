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
import { balanceTotals } from '../libs/balance'
import { useNavigation } from '@react-navigation/native'
export type BalanceInfoProps = { balance: BalanceType; hideMetadata?: boolean }
const BalanceInfoE = ({ balance, hideMetadata }: BalanceInfoProps) => {
  const { navigate } = useNavigation()
  const modalOrders = useModal({ title: 'Pagos' })
  const { card, cash, total, transfers } = balanceTotals(balance)
  return (
    <View style={{ justifyContent: 'center' }}>
      <SpanMetadata {...balance} hidden={hideMetadata} />
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
          <PaymentsList
            payments={balance?.payments}
            onPressRow={(paymentId) => {
              modalOrders.toggleOpen()
              // @ts-ignore
              navigate('PaymentsDetails', { id: paymentId })
            }}
          />
        </StyledModal>
      </View>
      <View style={styles.totals}>
        <View style={styles.row}>
          <Text style={styles.label}>Efectivo: </Text>
          <CurrencyAmount style={styles.amount} amount={cash} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Transferencia: </Text>
          <CurrencyAmount style={styles.amount} amount={transfers} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tarjeta: </Text>
          <CurrencyAmount style={styles.amount} amount={card} />
        </View>
      </View>
      <View>
        <Text style={gStyles.h3}>Total</Text>
        <CurrencyAmount style={gStyles.h1} amount={total} />
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

const styles = StyleSheet.create({
  totals: {
    justifyContent: 'flex-end',
    flex: 1,
    margin: 'auto',
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
    marginVertical: 2
  },
  label: {
    width: 100,
    textAlign: 'right'
  },
  amount: {
    textAlign: 'right',
    width: 70
  }
})
