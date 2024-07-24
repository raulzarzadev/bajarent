import { ScrollView, View } from 'react-native'
import React from 'react'

import { FormStoreE } from './FormStore'
import { ServiceStores } from '../firebase/ServiceStore'
import ErrorBoundary from './ErrorBoundary'
import { gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'
import { useAuth } from '../contexts/authContext'

const ScreenCreateStore = ({ navigation }) => {
  const { handleSetStoreId } = useAuth()
  return (
    <ScrollView>
      <View style={gStyles.container}>
        <FormStoreE
          onSubmit={async (values) => {
            return await ServiceStores.create(values)
              .then((res) => {
                if (res.res.id) {
                  handleSetStoreId(res.res.id)
                }
              })
              .catch(console.error)
              .finally(() => {
                //updateUserStores()
                navigation.goBack()
              })
          }}
        />
      </View>
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
