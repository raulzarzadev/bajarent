import { StyleSheet, View } from 'react-native'
import React from 'react'

import FormStore from './FormStore'
import { ServiceStores } from '../firebase/ServiceStore'

const ScreenCreateStore = ({ navigation }) => {
  return (
    <View style={[styles.form]}>
      <FormStore
        onSubmit={async (values) => {
          return await ServiceStores.create(values)
            .then(console.log)
            .catch(console.error)
            .finally(() => {
              navigation.goBack()
            })
        }}
      />
    </View>
  )
}

export default ScreenCreateStore

const styles = StyleSheet.create({
  form: {
    maxWidth: 500,
    width: '100%',
    marginHorizontal: 'auto'
  }
})
