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
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderType from '../types/OrderType'
import Tabs from './Tabs'
import SpanOrder from './SpanOrder'

const ModalCurrentWork = () => {
  const { storeId } = useStore()
  const { user } = useAuth()
  const userId = user?.id
  const modalCurrentWork = useModal({ title: 'Trabajo de hoy' })
  const [payments, setPayments] = useState<PaymentType[]>([])
  const [loading, setLoading] = useState(false)
  const handleUpdate = () => {
    setLoading(true)
    handleGetOrders()
    ServicePayments.getBetweenDates({
      fromDate: startDate(date),
      toDate: endDate(date),
      storeId,
      userId
    })
      .then(setPayments)
      .finally(() => {
        setTimeout(() => {
          setLoading(false)
        }, 400)
      })
  }
  const date = new Date()
  useEffect(() => {
    if (user) handleUpdate()
  }, [user])

  const [pickedUp, setPickedUp] = useState<OrderType[]>([])
  const [delivered, setDelivered] = useState<OrderType[]>([])
  const [renewed, setRenewed] = useState<OrderType[]>([])

  const handleGetOrders = () => {
    ServiceOrders.getDelivered(
      {
        storeId,
        userId,
        fromDate: startDate(date),
        toDate: endDate(date)
      },
      { justRefs: true, fromCache: true }
    ).then((orders) => {
      setDelivered(orders)
    })
    ServiceOrders.getRenewed(
      {
        storeId,
        userId,
        fromDate: startDate(date),
        toDate: endDate(date)
      },
      { justRefs: true, fromCache: true }
    ).then((orders) => {
      setRenewed(orders)
    })
    ServiceOrders.getPickedUp(
      {
        storeId,
        userId,
        fromDate: startDate(date),
        toDate: endDate(date)
      },
      { justRefs: true, fromCache: true }
    ).then((orders) => {
      setPickedUp(orders)
    })
  }
  console.log({ pickedUp, delivered, renewed })
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
            disabled={loading}
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
