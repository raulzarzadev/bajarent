import ButtonConfirm from '../ButtonConfirm'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import { View } from 'react-native'
import InputSearch from '../Inputs/InputSearch'
import { useState } from 'react'
import { CustomerType } from '../../state/features/costumers/customerType'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import { useStore } from '../../contexts/storeContext'

export function ButtonChangeOrderCustomer({
  orderId,
  customerId
}: {
  orderId?: string
  customerId?: string
}) {
  const [newCustomer, setNewCustomer] = useState<CustomerType>()
  const { store } = useStore()
  const { data } = useCustomers()
  const customer = data.find((c) => c.id === customerId)

  const handleConfirm = async () => {
    console.log('change customer', customerId, '->', newCustomer.id)
    try {
      await ServiceOrders.update(orderId, {
        customerId: newCustomer.id
      })
      ServiceOrders.addComment({
        orderId,
        content: `Cliente cambiado de ${customer.name} -> ${newCustomer.name}`,
        type: 'comment',
        storeId: store.id,
        variant: 'regular_comment'
      })
    } catch (error) {
      console.error(error)
    }
    return
  }
  return (
    <ButtonConfirm
      openSize="small"
      modalTitle="Cambiar cliente"
      openLabel="Cambiar cliente"
      icon="swap"
      handleConfirm={handleConfirm}
    >
      <View style={{ marginBottom: 8 }}>
        <InputSearch
          suggestions={data}
          labelKey="name"
          onSelect={(customer) => setNewCustomer(customer)}
        />
      </View>
    </ButtonConfirm>
  )
}
