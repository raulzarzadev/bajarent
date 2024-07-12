import { Text, View, StyleSheet } from 'react-native'
import React from 'react'
import CurrencyAmount from './CurrencyAmount'
import dictionary from '../dictionary'
import DateCell from './DateCell'
import { gStyles } from '../styles'
import { colors } from '../theme'
import PaymentVerify from './PaymentVerify'
import PaymentType from '../types/PaymentType'
import SpanUser from './SpanUser'
export type PaymentTypeList = PaymentType & { createdByName?: string }
const RowPayment = ({
  item,
  onVerified
}: {
  item: PaymentTypeList
  onVerified?: () => void
}) => {
  const isRetirement = !!item?.isRetirement
  return (
    <View
      style={[
        styles.row,
        item.canceled && { backgroundColor: colors.lightGray, opacity: 0.4 },
        isRetirement && {
          backgroundColor: colors.white
        }
      ]}
    >
      <View style={{ width: 80 }}>
        {isRetirement && (
          <View>
            <Text style={gStyles.helper}>{dictionary(item?.type)}</Text>
            <SpanUser userId={item?.employeeId} />
            <Text style={gStyles.helper}>{item?.description}</Text>
          </View>
        )}
        <Text>
          {!!item?.orderFolio &&
            `${item?.orderFolio || ''}-${item?.orderNote || ''}`}
        </Text>
        <Text numberOfLines={2}>{item?.orderName || ''}</Text>
      </View>
      <DateCell date={item?.createdAt} />
      <View style={{ width: 80 }}>
        <Text
          numberOfLines={1}
          style={{ textTransform: 'capitalize', textAlign: 'center' }}
        >
          {dictionary(item?.method)}
        </Text>
        {!!item?.reference && (
          <Text numberOfLines={1} style={[gStyles.tCenter, gStyles.helper]}>
            {item?.reference}
          </Text>
        )}
      </View>
      <View style={{ width: 80 }}>
        <Text>{item?.createdByName}</Text>
      </View>
      <View style={{ width: 80 }}>
        {typeof item?.verified === 'boolean' && (
          <View style={{ margin: 'auto' }}>
            <PaymentVerify payment={item} onVerified={onVerified} />
          </View>
        )}
        <CurrencyAmount
          amount={isRetirement ? -1 * item?.amount : item?.amount}
        />
        <Text style={[gStyles.helper, gStyles.tCenter]}>
          {item?.canceled && 'Cancelado'}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
    width: '100%'
  }
})

export default RowPayment
