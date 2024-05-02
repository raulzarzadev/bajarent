import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BalanceType } from '../types/BalanceType'
import DateCell from './DateCell'
import ErrorBoundary from './ErrorBoundary'
import { gSpace, gStyles } from '../styles'
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

import Icon from './Icon'

export type BalanceInfoProps = { balance: BalanceType; hideMetadata?: boolean }
const BalanceInfoE = ({ balance, hideMetadata }: BalanceInfoProps) => {
  const { navigate } = useNavigation()
  const modalPayments = useModal({ title: 'Pagos' })
  const { card, cash, total, transfers } = balanceTotals(balance)
  const paidOrdersIds = balance?.payments.map((p) => p.orderId)
  const uniquePaidOrdersIds = [...new Set(paidOrdersIds)]

  return (
    <View style={{ justifyContent: 'center' }}>
      <SpanMetadata {...balance} hidden={hideMetadata} />
      {/* 
          BALANCE TYPE
       */}
      <Text style={gStyles.h3}>
        Tipo:{' '}
        <Text style={[gStyles.h3, { textTransform: 'capitalize' }]}>
          {dictionary(balance?.type)}{' '}
        </Text>
      </Text>
      <Text style={[gStyles.tCenter]}>
        {balance?.type === 'partial' && <SpanUser userId={balance.userId} />}
      </Text>
      {/* 
          BALANCE DATES
       */}
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          marginVertical: 8
        }}
      >
        <DateCell label="Desde" date={balance?.fromDate} showTime labelBold />
        <View style={{ marginHorizontal: 8 }}>
          <Icon icon="rowRight" />
        </View>
        <DateCell label="Hasta" date={balance?.toDate} showTime labelBold />
      </View>
      {/* 
          BALANCE AMOUNTS
       */}
      <View
        style={{
          width: 180,
          marginVertical: gSpace(2),
          marginHorizontal: 'auto'
        }}
      >
        <View style={styles.totals}>
          <View style={styles.row}>
            <Text style={[styles.label]}>Efectivo: </Text>
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
          <View style={styles.row}>
            <Text style={styles.label}>Retiros: </Text>
            <CurrencyAmount style={styles.amount} amount={-0} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'flex-end'
            }}
          >
            <Text style={[gStyles.h3, { marginRight: 8 }]}>Total</Text>
            <CurrencyAmount style={gStyles.h1} amount={total} />
          </View>
        </View>
      </View>
      {/* 
          BALANCE ORDERS
       */}

      <View>
        <Text style={[gStyles.h2, { textAlign: 'left' }]}>Ordenes</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <ModalOrders
            modalTitle="creadas"
            buttonLabel="Creadas"
            ordersIds={uniquePaidOrdersIds}
          />
          <ModalOrders
            modalTitle=" entregadas"
            buttonLabel="Entregadas"
            ordersIds={balance.ordersDelivered}
          />
          <ModalOrders
            modalTitle=" Recogidas"
            buttonLabel="Recogidas"
            ordersIds={balance.ordersPickup}
          />
          <ModalOrders
            modalTitle=" Renovadas"
            buttonLabel="Renovadas"
            ordersIds={balance.ordersRenewed}
          />
        </View>
      </View>
    </View>
  )
}

const ModalOrders = ({
  ordersIds = [],
  buttonLabel,
  modalTitle
}: {
  ordersIds: string[]
  buttonLabel: string
  modalTitle: string
}) => {
  const { navigate } = useNavigation()

  return (
    <View>
      <View
        style={{
          // width: 180,
          marginVertical: gSpace(2)
          // marginHorizontal: 'auto'
        }}
      >
        <Button
          size="xs"
          label={`${buttonLabel} ${ordersIds.length || 0}`}
          variant="ghost"
          onPress={() => {
            // @ts-ignore
            navigate('OrdersList', { orders: ordersIds, title: modalTitle })
          }}
          fullWidth={false}
        ></Button>
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
