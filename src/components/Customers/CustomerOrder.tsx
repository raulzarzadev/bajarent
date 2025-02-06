import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { useCustomers } from '../../state/features/costumers/costumersSlice'

import { CustomerCardE } from './CustomerCard'
import ClientName from '../ClientName'
import { ButtonAddCustomerE } from './ButtonAddCustomer'
import OrderContacts from '../OrderContacts'
import OrderImages from '../OrderImages'
import { OrderAddress } from '../OrderDetails'
import { gStyles } from '../../styles'
import { useOrderDetails } from '../../contexts/orderContext'
import OrderType from '../../types/OrderType'
import { useEffect, useState } from 'react'
import { CustomerType } from '../../state/features/costumers/customerType'

const CustomerOrder = (props?: CustomerOrderProps) => {
  const { order } = useOrderDetails()
  const { data: customers, loading } = useCustomers()
  const [customer, setCustomer] = useState<CustomerType | undefined>()
  useEffect(() => {
    const customerId = props?.customerId || order?.customerId
    const customer = customers?.find((c) => c.id === customerId)
    setCustomer(customer)
  }, [customers, order])
  if (loading) return <Text>Loading...</Text>
  return (
    <View>
      {customer ? (
        <CustomerCardE customer={customer} />
      ) : (
        <OrderCustomerNotFound order={order} />
      )}
    </View>
  )
}

export const OrderCustomerNotFound = ({ order }: { order: OrderType }) => {
  return (
    <View>
      <View
        style={{
          padding: 4,
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <ClientName order={order} style={gStyles.h1} />
        <ButtonAddCustomerE order={order} />
      </View>
      <OrderContacts />
      <OrderImages order={order} />
      <ErrorBoundary componentName="OrderAddress">
        <OrderAddress order={order} />
      </ErrorBoundary>
    </View>
  )
}

export default CustomerOrder
export type CustomerOrderProps = {
  customerId?: string
}
export const CustomerOrderE = (props: CustomerOrderProps) => (
  <ErrorBoundary componentName="CustomerOrder">
    <CustomerOrder {...props} />
  </ErrorBoundary>
)
