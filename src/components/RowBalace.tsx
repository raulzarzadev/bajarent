import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
// import { dateFormat, fromNow } from '../libs/utils-date'
import theme, { STATUS_COLOR } from '../theme'
import { OrderDirectives } from './OrderDetails'
import ClientName from './ClientName'
import { gStyles } from '../styles'

const RowBalance = () => {
  // const fields: {
  //   field: string
  //   width: ViewStyle['width']
  //   component: ReactNode
  // }[] = [
  //   {
  //     field: 'folio',
  //     width: '30%',
  //     component: (
  //       <View>
  //         <Text style={{ textAlign: 'center' }} numberOfLines={1}>
  //           <Text style={gStyles.tBold}>{`${
  //             order?.priority ? `(${order.priority})` : ''
  //           }`}</Text>{' '}
  //           {order.folio}
  //         </Text>
  //         <Text style={{ textAlign: 'center' }} numberOfLines={2}>
  //           <ClientName order={order} />
  //         </Text>
  //       </View>
  //     )
  //   },

  //   {
  //     field: 'neighborhood',
  //     width: '20%',
  //     component: (
  //       <View>
  //         <Text>{order?.neighborhood}</Text>
  //       </View>
  //     )
  //   },
  //   {
  //     field: 'status',
  //     width: '50%',
  //     component: (
  //       <View>
  //         <OrderDirectives order={order} />
  //       </View>
  //     )
  //   }
  // ]
  return (
    <View style={[styles.container]}>
      <Text style={styles.text}>Folio</Text>
      {/* {fields.map(({ field, component, width }) => (
        <View key={field} style={{ width }}>
          {component}
        </View>
      ))} */}
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
