import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import OrderType from '../types/OrderType'
import { useEffect, useState } from 'react'
import ErrorBoundary from './ErrorBoundary'
import { getFullOrderData } from '../contexts/libs/getFullOrderData'
import { gStyles } from '../styles'
import FormOrderRenew, { FormOrderRenewE } from './FormOrderRenew'
import InputImagePicker from './InputImagePicker'
import { ServiceOrders } from '../firebase/ServiceOrders'
import InputLocation from './InputLocation'
import { getCoordinatesAsString } from '../libs/maps'
import { CustomerOrderE } from './Customers/CustomerOrder'

const ScreenOrderRenew = ({ route }) => {
  const orderId = route?.params?.orderId
  const [order, setOrder] = useState<OrderType | null>(null)

  useEffect(() => {
    getFullOrderData(orderId).then((order) => setOrder(order))
  }, [])
  if (!order) return <ActivityIndicator />
  const customerIsSet = typeof order.customerId === 'string'
  return (
    <ScrollView>
      <View style={gStyles.container}>
        <View>
          <Text style={gStyles.tCenter}>
            Renovación de{' '}
            <Text style={gStyles.h3}>
              {order.folio} {order.note ? `-${order.note}` : ''}
            </Text>
          </Text>
        </View>
        {customerIsSet && <CustomerOrderE customerId={order.customerId} />}
        {!customerIsSet && (
          <>
            <View style={{ position: 'relative' }}>
              <InputImagePicker
                label={'Fachada'}
                name={'imageHouse'}
                value={order?.imageHouse}
                setValue={async (value) => {
                  const res = await ServiceOrders.update(orderId, {
                    imageHouse: value
                  })
                  console.log({ res })
                }}
              />
              <InputImagePicker
                name={'imageID'}
                label={'Identificación'}
                value={order?.imageID}
                setValue={async (value) => {
                  const res = await ServiceOrders.update(orderId, {
                    imageID: value
                  })
                  console.log({ res })
                }}
              />

              <InputLocation
                helperText={'Ubicación de la casa'}
                value={order?.location}
                setValue={(value) => {
                  ServiceOrders.update(orderId, {
                    location: getCoordinatesAsString(value)
                  })
                    .then(console.log)
                    .catch(console.error)
                }}
              />
            </View>
          </>
        )}
        <FormOrderRenewE order={order} />
      </View>
    </ScrollView>
  )
}

export const ScreenOrderRenewE = (props) => (
  <ErrorBoundary componentName="ScreenOrderRenew">
    <ScreenOrderRenew {...props} />
  </ErrorBoundary>
)

export default ScreenOrderRenew
