import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import PaymentType from '../types/PaymentType'
import { ServicePayments } from '../firebase/ServicePayments'
import { endDate, startDate } from '../libs/utils-date'
import { useStore } from '../contexts/storeContext'
import { payments_amount } from '../libs/payments'
import { gStyles } from '../styles'
import BalanceAmounts from './BalanceAmounts'
import { useEmployee } from '../contexts/employeeContext'

const DateCounts = ({ date }: { date: Date }) => {
  const [payments, setPayments] = useState<PaymentType[]>([])

  const { storeId, storeSections, staff } = useStore()
  const {
    permissions: { isAdmin, isOwner }
  } = useEmployee()

  useEffect(() => {
    ServicePayments.getBetweenDates({
      fromDate: startDate(date),
      toDate: endDate(date),
      storeId
    }).then(setPayments)
  }, [])

  console.log({ payments, storeSections, staff })

  //* If the user is NOT an admin or owner, return null
  if (!(isAdmin || isOwner)) return null
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {staff.map(({ userId, position, name }) => {
        const userPayments = payments?.filter((p) => p?.createdBy === userId)
        if (userPayments.length === 0) return null
        return (
          <View key={userId}>
            <Text style={gStyles.h3}>{position || name}</Text>
            <BalanceAmounts payments={userPayments} />
          </View>
        )
      })}
    </View>
  )
}

export default DateCounts

const styles = StyleSheet.create({})
