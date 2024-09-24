import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StyledModal from './StyledModal'
import CurrencyAmount from './CurrencyAmount'
import useModal from '../hooks/useModal'
import { BalanceAmountsE } from './BalanceAmounts'
import { payments_amount } from '../libs/payments'
import { gStyles } from '../styles'
import Button from './Button'

import Tabs from './Tabs'
import SpanOrder from './SpanOrder'
import ProgressBar from './ProgressBar'
import { useCurrentWorkCtx } from '../contexts/currentWorkContext'

const ModalCurrentWork = () => {
  const {
    payments,
    pickedUpOrders,
    deliveredOrders,
    renewedOrders,
    progress,
    handleRefresh
  } = useCurrentWorkCtx()

  const modalCurrentWork = useModal({ title: 'Trabajo de hoy' })

  return (
    <View style={{ marginRight: 8 }}>
      <Pressable onPress={modalCurrentWork.toggleOpen}>
        <ProgressWork progress={progress.total} />
        <CurrencyAmount
          style={gStyles.tBold}
          amount={payments_amount(payments).total}
        />
      </Pressable>
      <StyledModal {...modalCurrentWork}>
        <ProgressWorkDetails
          progressNew={progress.new}
          progressExpired={progress.expired}
          progressReports={progress.reports}
        />

        <BalanceAmountsE payments={payments} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            marginTop: 16
          }}
        >
          <Tabs
            defaultTab={null}
            tabs={[
              {
                title: `Recogidas: ${pickedUpOrders?.length || 0}`,
                content: (
                  <TabOrderList
                    orders={pickedUpOrders}
                    onRedirect={modalCurrentWork.toggleOpen}
                  />
                ),
                show: true
              },
              {
                title: `Entregadas: ${deliveredOrders?.length || 0}`,
                content: (
                  <TabOrderList
                    orders={deliveredOrders}
                    onRedirect={modalCurrentWork.toggleOpen}
                  />
                ),
                show: true
              },
              {
                title: `Renovadas: ${renewedOrders?.length || 0}`,
                content: (
                  <TabOrderList
                    orders={renewedOrders}
                    onRedirect={modalCurrentWork.toggleOpen}
                  />
                ),
                show: true
              }
            ]}
          />
        </View>
      </StyledModal>
    </View>
  )
}
const ProgressWorkDetails = ({
  progressNew = 0,
  progressReports = 0,
  progressExpired = 0
}) => {
  return (
    <View style={{ marginVertical: 16 }}>
      <ProgressWork progress={progressNew} label={'Pedidos'} />
      <ProgressWork progress={progressReports} label={'Reportes'} />
      <ProgressWork progress={progressExpired} label={'Vencidas'} />
    </View>
  )
}
const ProgressWork = ({ progress = 0, label = '' }) => {
  //* if progress less than 25% color is error, if less than 50% color is warning, if less than 75% color is primary, else color is success
  const color =
    progress < 25
      ? 'error'
      : progress < 50
      ? 'warning'
      : progress < 75
      ? 'success'
      : 'primary'

  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 4
      }}
    >
      <Text style={[{ textAlign: 'center' }, gStyles.helper]}>
        {label} {progress.toFixed(0)}%
      </Text>
      <ProgressBar progress={progress} color={color} />
    </View>
  )
}

const TabOrderList = ({ orders, onRedirect }) => {
  return (
    <View style={{ paddingHorizontal: 8, marginVertical: 16 }}>
      {orders.map((order) => (
        <View key={order.id} style={{ marginVertical: 4 }}>
          <SpanOrder
            orderId={order.id}
            showName
            redirect
            onRedirect={onRedirect}
          />
        </View>
      ))}
    </View>
  )
}

export default ModalCurrentWork

const styles = StyleSheet.create({})
