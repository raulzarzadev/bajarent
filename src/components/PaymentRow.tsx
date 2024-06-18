import { Text, View, StyleSheet } from 'react-native'
import React from 'react'
import CurrencyAmount from './CurrencyAmount'
import dictionary from '../dictionary'
import DateCell from './DateCell'
import { gStyles } from '../styles'
import { PaymentTypeList } from './ListPayments'
import { colors } from '../theme'
import PaymentVerify from './PaymentVerify'

const RowPayment = ({ item }: { item: PaymentTypeList }) => {
  return (
    <View
      style={[
        styles.row,
        item.canceled && { backgroundColor: colors.lightGray, opacity: 0.4 }
      ]}
    >
      <View style={{ width: 80 }}>
        <Text>
          {item?.orderFolio || ''}-{item?.orderNote || ''}
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
            <PaymentVerify payment={item} />
          </View>
        )}
        <CurrencyAmount amount={item?.amount} />
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
