import { StyleSheet, View } from 'react-native'
import React from 'react'

import FormStore from './FormStore'
import { ServiceStores } from '../firebase/ServiceStore'
import ErrorBoundary from './ErrorBoundary'

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

export default function (props) {
  return (
    <ErrorBoundary componentName="ScreenCreateStore" {...props}>
      <ScreenCreateStore {...props} />
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  form: {
    maxWidth: 500,
    width: '100%',
    marginHorizontal: 'auto'
  }
})
