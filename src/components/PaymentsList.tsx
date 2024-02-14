import { StyleSheet, View } from 'react-native'

import PaymentType from '../types/PaymentType'
import List from './List'
import PaymentRow from './PaymentRow'

function PaymentsList({
  payments,
  onPressRow
}: {
  payments: PaymentType[]
  onPressRow?: (paymentId: string) => void
}) {
  const sortFields = [
    { key: 'date', label: 'Fecha' },
    { key: 'amount', label: 'Cantidad' },
    { key: 'method', label: 'Método' }
  ]

  return (
    <>
      <View style={styles.container}>
        <List
          data={payments}
          ComponentRow={PaymentRow}
          sortFields={sortFields}
          defaultSortBy="date"
          defaultOrder="des"
          onPressRow={(id) => {
            onPressRow?.(id)
            console.log({ id })
          }}
          filters={[
            // {
            //   field: 'date',
            //   label: 'Fecha'
            // },
            {
              field: 'method',
              label: 'Método'
            }
          ]}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    // padding: 12,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderList: {
    width: '100%',
    // paddingVertical: 40,
    paddingHorizontal: 4
  }
})

export default PaymentsList
