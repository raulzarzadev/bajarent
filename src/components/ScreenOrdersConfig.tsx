import { ScrollView, View } from 'react-native'
import React from 'react'
import FormOrdersConfig from './FormOrdersConfig'
import { gStyles } from '../styles'
import { useAuth } from '../contexts/authContext'
import { ServiceStores } from '../firebase/ServiceStore'
import Loading from './Loading'

const ScreenOrdersConfig = () => {
  const handleSubmit = async (values) => {
    try {
      const res = await ServiceStores.update(store.id, values)
      console.log({ res })
      return res
    } catch (e) {
      console.error({ e })
    }
  }
  const { store } = useAuth()
  const storeOrdersConfig = {
    orderTypes: store?.orderTypes || null,
    orderFields: store?.orderFields || null
  }

  if (!store) return <Loading />

  return (
    <ScrollView>
      <View style={gStyles.container}>
        <FormOrdersConfig
          onSubmit={handleSubmit}
          defaultValues={storeOrdersConfig}
        />
      </View>
    </ScrollView>
  )
}

export default ScreenOrdersConfig
