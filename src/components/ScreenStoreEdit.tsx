import { ActivityIndicator, ScrollView, View } from 'react-native'
import React from 'react'
import { FormStoreE } from './FormStore'
import { ServiceStores } from '../firebase/ServiceStore'
import { useStore } from '../contexts/storeContext'
import ButtonConfirm from './ButtonConfirm'
import { gStyles } from '../styles'
import { clearStorage } from '../firebase/auth'
import { useAuth } from '../contexts/authContext'

const ScreenStoreEdit = ({ navigation }) => {
  const { navigate } = navigation
  const { handleSetStoreId } = useAuth()
  const { store } = useStore()
  if (!store) return <ActivityIndicator />
  return (
    <ScrollView>
      <View style={gStyles.container}>
        <FormStoreE
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
                .finally(() => {
                  handleSetStoreId('')
                  clearStorage()
                  navigate('Profile')
                })
              //navigation.goBack()
            }}
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default ScreenStoreEdit
