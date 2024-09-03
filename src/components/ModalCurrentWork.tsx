import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import StyledModal from './StyledModal'
import CurrencyAmount from './CurrencyAmount'
import useModal from '../hooks/useModal'
import PaymentType from '../types/PaymentType'
import { ServicePayments } from '../firebase/ServicePayments'
import { endDate, startDate } from '../libs/utils-date'
import { useStore } from '../contexts/storeContext'
import { useAuth } from '../contexts/authContext'
import BalanceAmounts, { BalanceAmountsE } from './BalanceAmounts'
import { payments_amount } from '../libs/payments'
import { gStyles } from '../styles'
import Button from './Button'

import Tabs from './Tabs'
import SpanOrder from './SpanOrder'
import { useEmployee } from '../contexts/employeeContext'

const ModalCurrentWork = () => {
  const { todayWork } = useEmployee()
  const pickedUp = todayWork?.pickedUp
  const delivered = todayWork?.delivered
  const renewed = todayWork?.renewed
  const payments = todayWork?.payments
  const handleUpdate = todayWork?.handleUpdate
  const modalCurrentWork = useModal({ title: 'Trabajo de hoy' })

  return (
    <View style={{ marginRight: 8 }}>
      <Pressable onPress={modalCurrentWork.toggleOpen}>
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
