import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
// import { dateFormat, fromNow } from '../libs/utils-date'
import theme, { STATUS_COLOR } from '../theme'
import { OrderDirectives } from './OrderDetails'
import ClientName from './ClientName'
import { gStyles } from '../styles'

const RowBalance = () => {
  const fields: {
    field: string
    width: ViewStyle['width']
    component: ReactNode
  }[] = [
    {
      field: 'folio',
      width: '30%',
      component: (
        <View>
          <Text style={{ textAlign: 'center' }} numberOfLines={1}></Text>
          <Text style={gStyles.tBold}></Text>
          <Text style={{ textAlign: 'center' }} numberOfLines={2}></Text>
        </View>
      )
    },
    {
      field: 'neighborhood',
      width: '20%',
      component: <View></View>
    },
    {
      field: 'status',
      width: '50%',
      component: <View></View>
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
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: theme.neutral,
    backgroundColor: STATUS_COLOR.PENDING
  }
})
