import { StyleSheet, View } from 'react-native'
import React from 'react'

import FormStore from './FormStore'
import { ServiceStores } from '../firebase/ServiceStore'

const ScreenCreateStore = () => {
  return (
    <View>
      <FormStore
        onSubmit={async (values) => {
          ServiceStores.create(values).then(console.log).catch(console.error)
        }}
      />
    </View>
  )
}

export default ScreenCreateStore

const styles = StyleSheet.create({})
