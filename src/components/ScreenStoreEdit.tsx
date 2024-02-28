import { ActivityIndicator, Text, View } from 'react-native'
import React from 'react'

import FormStore from './FormStore'
import { ServiceStores } from '../firebase/ServiceStore'
import { useStore } from '../contexts/storeContext'
import Button from './Button'
import { Icon } from 'react-native-elements'
import theme from '../theme'
import ButtonConfirm from './ButtonConfirm'

const ScreenStoreEdit = ({ navigation }) => {
  const { store } = useStore()
  if (!store) return <ActivityIndicator />
  return (
    <View style={{ maxWidth: 500, width: '100%', marginHorizontal: 'auto' }}>
      <FormStore
        defaultValues={store}
        onSubmit={async (values) => {
          ServiceStores.update(store.id, values)
            .then((res) => {
              console.log(res)
              navigation.goBack()
            })
            .catch(console.error)
        }}
      />
      <View style={{ marginTop: 36 }}>
        <ButtonConfirm
          icon="delete"
          text="Eliminar tienda de forma permanente"
          openColor="error"
          openLabel="Eliminar"
          confirmColor="error"
          confirmLabel="Eliminar"
          handleConfirm={async () => {
            ServiceStores.delete(store.id)
              .then(console.log)
              .catch(console.error)
            navigation.goBack()
          }}
        />
      </View>
    </View>
  )
}

export default ScreenStoreEdit
