import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BalanceType } from '../types/BalanceType'
import DateCell from './DateCell'
import ErrorBoundary from './ErrorBoundary'
import { gSpace, gStyles } from '../styles'
import Button from './Button'
import CurrencyAmount from './CurrencyAmount'
import dictionary from '../dictionary'
import SpanUser from './SpanUser'
import SpanMetadata from './SpanMetadata'
import { useNavigation } from '@react-navigation/native'

import Icon from './Icon'
import { payments_amount } from '../libs/payments'
import BalanceAmounts from './BalanceAmounts'

export type BalanceInfoProps = { balance: BalanceType; hideMetadata?: boolean }
const BalanceInfoE = ({ balance, hideMetadata }: BalanceInfoProps) => {
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
      <BalanceAmounts payments={balance.payments} />

      {/* 
          BALANCE ORDERS
       */}

      <View>
        <Text style={[gStyles.h2, { textAlign: 'left' }]}>Ordenes</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            flexWrap: 'wrap'
          }}
        >
          <ModalOrders
            modalTitle="Pagadas"
            buttonLabel="Pagadas"
            ordersIds={balance?.paidOrders}
          />
          <ModalOrders
            modalTitle=" Rentas"
            buttonLabel="Rentas"
            ordersIds={balance?.ordersDelivered}
          />
          <ModalOrders
            modalTitle=" Recogidas"
            buttonLabel="Recogidas"
            ordersIds={balance?.ordersPickup}
          />
          <ModalOrders
            modalTitle=" Renovadas"
            buttonLabel="Renovadas"
            ordersIds={balance?.ordersRenewed}
          />
          <ModalOrders
            modalTitle=" Canceladas"
            buttonLabel="Canceladas"
            ordersIds={balance?.ordersCancelled}
          />
          <ModalOrders
            modalTitle="En renta"
            buttonLabel="En Renta"
            ordersIds={balance?.ordersInRent}
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
            // navigate('ScreenOrders')
            //@ts-ignore
            navigate('StackOrders', {
              screen: 'ScreenOrders',
              params: {
                orders: ordersIds,
                title: modalTitle,
                showRentData: true
              }
            })
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
