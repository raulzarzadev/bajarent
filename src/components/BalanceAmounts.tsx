import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PaymentType from '../types/PaymentType'
import { payments_amount } from '../libs/payments'
import { gSpace, gStyles } from '../styles'
import CurrencyAmount from './CurrencyAmount'
import { useNavigation } from '@react-navigation/native'

const BalanceAmounts = ({ payments }: { payments: PaymentType[] }) => {
  const cashPayments = payments.filter((p) => p.method === 'cash')
  const cardPayments = payments.filter((p) => p.method === 'card')
  const transferPayments = payments.filter((p) => p.method === 'transfer')
  const canceledPayments = payments.filter((p) => p.canceled)
  const { total, canceled, card, cash, transfers } = payments_amount(payments)
  return (
    <View>
      <View
        style={{
          width: 180,
          marginVertical: gSpace(2),
          marginHorizontal: 'auto'
        }}
      >
        <View style={styles.totals}>
          <View style={styles.row}>
            <LinkPayments
              paymentsIds={cashPayments.map(({ id }) => id)}
              amount={cash}
              title={'Efectivo'}
            />
          </View>
          <View style={styles.row}>
            <LinkPayments
              paymentsIds={transferPayments.map(({ id }) => id)}
              amount={transfers}
              title={'Transferencias'}
            />
          </View>
          <View style={styles.row}>
            <LinkPayments
              paymentsIds={cardPayments.map(({ id }) => id)}
              amount={card}
              title={'Tarjetas'}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'flex-end'
            }}
          >
            <LinkPayments
              paymentsIds={payments.map(({ id }) => id)}
              amount={total}
              title={'Total'}
              isTotal
            />
          </View>
        </View>
        {!!canceledPayments.length && (
          <View style={styles.row}>
            <LinkPayments
              paymentsIds={canceledPayments.map(({ id }) => id)}
              amount={canceled}
              title={'Cancelados'}
            />
          </View>
        )}
      </View>
    </View>
  )
}

const LinkPayments = ({
  title,
  paymentsIds = [],
  amount = 0,
  isTotal = false
}) => {
  const { navigate } = useNavigation()
  return (
    <View
      style={[
        { flexDirection: 'row' },
        isTotal && {
          borderWidth: 1,
          borderColor: 'black',
          borderRadius: 5,
          padding: 5
        }
      ]}
    >
      <Pressable
        onPress={() => {
          //@ts-ignore
          navigate('StackPayments', {
            screen: 'ScreenPayments',
            params: {
              title,
              payments: paymentsIds
            }
          })
        }}
      >
        <Text style={[styles.label, { textDecorationLine: 'underline' }]}>
          {title}:{' '}
        </Text>
      </Pressable>
      <CurrencyAmount style={styles.amount} amount={amount} />
    </View>
  )
}

export default BalanceAmounts

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
