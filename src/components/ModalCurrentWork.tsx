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
import { useEmployee } from '../contexts/employeeContext'
import ProgressBar from './ProgressBar'
import useCurrentWork from '../hooks/useCurrentWork'

const ModalCurrentWork = () => {
  const { todayWork } = useEmployee()
  const pickedUp = todayWork?.pickedUp
  const delivered = todayWork?.delivered
  const renewed = todayWork?.renewed
  const payments = todayWork?.payments
  const handleUpdate = todayWork?.handleUpdate
  const modalCurrentWork = useModal({ title: 'Trabajo de hoy' })
  const { progressExpired, progressNew, progressReports, progressTotal } =
    useCurrentWork()

  return (
    <View style={{ marginRight: 8 }}>
      <Pressable onPress={modalCurrentWork.toggleOpen}>
        <ProgressWork progress={progressTotal} />
        <CurrencyAmount
          style={gStyles.tBold}
          amount={payments_amount(payments).total}
        />
      </Pressable>
      <StyledModal {...modalCurrentWork}>
        <View style={{ margin: 'auto' }}>
          <Button
            //disabled={loading}
            icon="refresh"
            onPress={handleUpdate}
            justIcon
          />
        </View>

        <ProgressWorkDetails
          progressNew={progressNew}
          progressExpired={progressExpired}
          progressReports={progressReports}
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
                title: `Recogidas: ${pickedUp?.length || 0}`,
                content: (
                  <TabOrderList
                    orders={pickedUp}
                    onRedirect={modalCurrentWork.toggleOpen}
                  />
                ),
                show: true
              },
              {
                title: `Entregadas: ${delivered?.length || 0}`,
                content: (
                  <TabOrderList
                    orders={delivered}
                    onRedirect={modalCurrentWork.toggleOpen}
                  />
                ),
                show: true
              },
              {
                title: `Renovadas: ${renewed?.length || 0}`,
                content: (
                  <TabOrderList
                    orders={renewed}
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
