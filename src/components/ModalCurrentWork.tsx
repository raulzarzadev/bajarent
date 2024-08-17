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

const ModalCurrentWork = () => {
  const { storeId } = useStore()
  const { user } = useAuth()
  const userId = user?.id
  const modalCurrentWork = useModal({ title: 'Trabajo de hoy' })
  const [payments, setPayments] = useState<PaymentType[]>([])
  const [loading, setLoading] = useState(false)
  const handleUpdate = () => {
    setLoading(true)
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

  const [pickedUp, setPickedUp] = useState(0)
  const [delivered, setDelivered] = useState(0)
  const [solved, setSolved] = useState(0)
  const [renewed, setRenewed] = useState(0)

  const handleGetOrders = () => {
    ServiceOrders.getDelivered({
      storeId,
      userId,
      fromDate: startDate(date),
      toDate: endDate(date)
    }).then((orders) => {
      setDelivered(orders.length)
    })
    ServiceOrders.getRenewed({
      storeId,
      userId,
      fromDate: startDate(date),
      toDate: endDate(date)
    }).then((orders) => {
      setRenewed(orders.length)
    })
    ServiceOrders.getPickedUp({
      storeId,
      userId,
      fromDate: startDate(date),
      toDate: endDate(date)
    }).then((orders) => {
      setPickedUp(orders.length)
    })
    // ServiceOrders.getSolved({
    //   storeId,
    //   userId,
    //   fromDate: startDate(date),
    //   toDate: endDate(date)
    // }).then((orders) => {
    //   setSolved(orders.length)
    // })
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
        <Button label="Ver ordenes" onPress={handleGetOrders} />
      </StyledModal>
    </View>
  )
}

export default ModalCurrentWork

const styles = StyleSheet.create({})
