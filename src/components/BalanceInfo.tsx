import { StyleSheet, Text, View } from 'react-native'
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

import { useStore } from '../contexts/storeContext'
import OrdersList from './OrdersList'
import Icon from './Icon'
import ListOrders from './ListOrders'

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

      <Text style={gStyles.h3}>Tipo:</Text>
      <Text style={[gStyles.h2, { textTransform: 'capitalize' }]}>
        {dictionary(balance?.type)}{' '}
      </Text>
      <Text style={[gStyles.tCenter]}>
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
        <DateCell label="Desde" date={balance?.fromDate} showTime labelBold />
        <View style={{ marginHorizontal: 8 }}>
          <Icon icon="rowRight" />
        </View>
        <DateCell label="Hasta" date={balance?.toDate} showTime labelBold />
      </View>
      <View
        style={{
          width: 180,
          marginVertical: gSpace(2),
          marginHorizontal: 'auto'
        }}
      >
        <View>
          <Text
            style={[
              gStyles.h3,
              { marginTop: gSpace(3), marginBottom: gSpace(2) }
            ]}
          >
            Pagos
          </Text>
        </View>
        <Button
          label={`Pagos ${balance?.payments.length || 0}`}
          // variant="ghost"
          size="small"
          onPress={modalPayments.toggleOpen}
        ></Button>
        <StyledModal {...modalPayments}>
          <PaymentsList
            payments={balance?.payments}
            onPressRow={(paymentId) => {
              modalPayments.toggleOpen()
              // @ts-ignore
              navigate('PaymentsDetails', { id: paymentId })
            }}
          />
        </StyledModal>
      </View>

      <ModalOrders
        ordersIds={uniquePaidOrdersIds}
        buttonLabel="Ordenes pagadas"
        modalTitle="Ordenes pagadas"
      />

      <View>
        <Text style={[gStyles.h3, { marginTop: gSpace(3) }]}>Ordenes</Text>
      </View>
      <ModalOrders
        ordersIds={balance?.ordersCreated}
        buttonLabel="Creadas"
        modalTitle="Ordenes creadas"
      />
      <ModalOrders
        ordersIds={balance?.ordersDelivered}
        buttonLabel="Entregadas"
        modalTitle="Ordenes entregadas"
      />
      <ModalOrders
        ordersIds={balance?.ordersPickup}
        buttonLabel="Recogidas"
        modalTitle="Ordenes recogidas"
      />
      <ModalOrders
        ordersIds={balance?.ordersRenewed}
        buttonLabel="Renovadas"
        modalTitle="Ordenes renovadas"
      />

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
  const modal = useModal({ title: modalTitle })
  const { orders } = useStore()
  const fullOrders = ordersIds?.map((orderId) =>
    orders.find((o) => o.id === orderId)
  )
  return (
    <View>
      <View
        style={{
          width: 180,
          marginVertical: gSpace(2),
          marginHorizontal: 'auto'
        }}
      >
        <Button
          size="small"
          label={`${buttonLabel} ${fullOrders.length || 0}`}
          // variant="ghost"
          onPress={modal.toggleOpen}
        ></Button>
      </View>
      <StyledModal {...modal}>
        <ListOrders
          orders={fullOrders}

          // onPressRow={(orderId) => {
          //   // @ts-ignore
          //   navigate('OrderDetails', { orderId })
          //   modal.toggleOpen()
          // }}
        />
      </StyledModal>
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
