import { ScrollView } from 'react-native'
import React from 'react'

import { FormStoreE } from './FormStore'
import { ServiceStores } from '../firebase/ServiceStore'
import ErrorBoundary from './ErrorBoundary'
import { gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'

const ScreenCreateStore = ({ navigation }) => {
  const { updateUserStores } = useStore()
  return (
    <ScrollView style={[gStyles.container]}>
      <FormStoreE
        onSubmit={async (values) => {
          return await ServiceStores.create(values)
            .then(console.log)
            .catch(console.error)
            .finally(() => {
              updateUserStores()
              navigation.goBack()
            })
        }}
      />
    </ScrollView>
  )
}

export default function (props) {
  return (
    <ErrorBoundary componentName="ScreenCreateStore" {...props}>
      <ScreenCreateStore {...props} />
    </ErrorBoundary>
  )
}
