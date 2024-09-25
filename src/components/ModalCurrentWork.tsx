import { FlexStyle, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StyledModal from './StyledModal'
import CurrencyAmount from './CurrencyAmount'
import useModal from '../hooks/useModal'
import { BalanceAmountsE } from './BalanceAmounts'
import { payments_amount } from '../libs/payments'
import { gStyles } from '../styles'

import SpanOrder from './SpanOrder'
import ProgressBar from './ProgressBar'
import { useCurrentWorkCtx } from '../contexts/currentWorkContext'
import ListOrders from './ListOrders'
import { useEmployee } from '../contexts/employeeContext'
import DisabledEmployee from './DisabledEmployee'

const ModalCurrentWork = () => {
  const { employee } = useEmployee()
  const { payments, progress } = useCurrentWorkCtx()

  const modalCurrentWork = useModal({ title: 'Trabajo de hoy' })

  return (
    <View style={{ marginRight: 8 }}>
      <Pressable onPress={modalCurrentWork.toggleOpen}>
        <ProgressWork progress={progress.total} size="lg" />
        <CurrencyAmount
          style={gStyles.helper}
          amount={payments_amount(payments).total}
        />
      </Pressable>
      <StyledModal {...modalCurrentWork}>
        {employee?.disabled ? (
          <DisabledEmployee></DisabledEmployee>
        ) : (
          <>
            <ProgressWorkDetails />
            <BalanceAmountsE payments={payments} />
          </>
        )}
      </StyledModal>
    </View>
  )
}
const ProgressWorkDetails = () => {
  const {
    progress,
    deliveredOrders,
    solvedReported,
    pickedUpOrders,
    renewedOrders
  } = useCurrentWorkCtx()

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        marginVertical: 16
      }}
    >
      <ModalOrdersListOfProgressWork
        progress={progress.new}
        label={'Pedidos'}
        orders={deliveredOrders}
      />

      <ModalOrdersListOfProgressWork
        progress={progress.reports}
        label={'Reportes'}
        orders={solvedReported}
      />
      <ModalOrdersListOfProgressWork
        progress={progress.expired}
        label={'Vencidas'}
        orders={[...pickedUpOrders, ...renewedOrders]}
      />
    </View>
  )
}

const ModalOrdersListOfProgressWork = ({ progress, label, orders = [] }) => {
  const modal = useModal({ title: label })
  return (
    <View style={{ marginVertical: 6 }}>
      <Pressable onPress={modal.toggleOpen}>
        <ProgressWork progress={progress} label={label} />
      </Pressable>
      <StyledModal {...modal}>
        <ListOrders orders={orders} />
      </StyledModal>
    </View>
  )
}
const ProgressWork = ({
  progress = 0,
  label = '',
  width = 'auto',
  size = 'md'
}: {
  progress: number
  label?: string
  width?: FlexStyle['width']
  size?: 'sm' | 'md' | 'lg'
}) => {
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
        marginTop: 4,
        width
      }}
    >
      <Text style={[{ textAlign: 'center' }]}>
        {label} {progress.toFixed(0)}%
      </Text>
      <ProgressBar progress={progress} color={color} size={size} />
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
