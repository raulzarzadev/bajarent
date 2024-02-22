import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import theme from '../theme'
import { BalanceType } from '../types/BalanceType'
import DateCell from './DateCell'
import dictionary from '../dictionary'
import SpanUser from './SpanUser'
import CurrencyAmount from './CurrencyAmount'

const RowBalance = ({ item }: { item: BalanceType }) => {
  const balanceTotal = item?.payments?.reduce(
    (acc, payment) => acc + payment?.amount || 0,
    0
  )
  const fields: {
    field: string
    width: ViewStyle['width']
    component: ReactNode
  }[] = [
    {
      field: 'CreatedAt',
      width: '20%',
      component: <DateCell date={item?.createdAt} />
    },
    {
      field: 'fromDate',
      width: '20%',
      component: <DateCell label="Desde" date={item?.fromDate} />
    },
    {
      field: 'toDate',
      width: '20%',
      component: <DateCell label="Hasta" date={item?.toDate} />
    },
    {
      field: 'type',
      width: '30%',
      component: (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text>{dictionary(item?.type)}</Text>
          {item.type === 'partial' && <SpanUser userId={item?.userId} />}
        </View>
      )
    },
    {
      field: 'payments',
      width: '10%',
      component: (
        <>
          <Text>{item?.payments?.length || 0}</Text>
          <CurrencyAmount amount={balanceTotal} />
        </>
      )
    }
  ]

  return (
    <View style={[styles.container]}>
      {fields.map(({ field, component, width }) => (
        <View key={field} style={{ width }}>
          {component}
        </View>
      ))}
    </View>
  )
}

export default RowBalance

const styles = StyleSheet.create({
  //
  text: {
    width: '33%',
    textAlign: 'center',
    alignSelf: 'center',
    verticalAlign: 'middle'
  },
  container: {
    flex: 1,
    padding: 4,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: theme.neutral
    // borderColor: theme.neutral,
    // backgroundColor: STATUS_COLOR.PENDING
  }
})
