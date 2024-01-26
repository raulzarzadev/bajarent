import {
  AccessibilityInfo,
  ActivityIndicator,
  StyleSheet,
  View
} from 'react-native'
import React from 'react'

import FormStore from './FormStore'
import { ServiceStores } from '../firebase/ServiceStore'
import { useStore } from '../contexts/storeContext'

const ScreenStoreEdit = ({ route, navigation }) => {
  const { store } = useStore()
  if (!store) return <ActivityIndicator />
  return (
    <View>
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
    </View>
  )
}

export default ScreenStoreEdit

const styles = StyleSheet.create({})
