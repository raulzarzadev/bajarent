import { StyleSheet, View } from 'react-native'
import React from 'react'
import FormSection from './FormSection'
import { ServiceSections } from '../firebase/ServiceSections'
import { useStore } from '../contexts/storeContext'

const ScreenSectionsNew = ({ navigator }) => {
  const { storeId } = useStore()
  return (
    <View style={styles.container}>
      <FormSection
        onSubmit={async (value) => {
          value.storeId = storeId
          return await ServiceSections.create(value)
            .then((res) => {
              console.log(res)
              navigator.goBack()
            })
            .catch((err) => {
              console.log({ err })
            })
        }}
      />
    </View>
  )
}

export default ScreenSectionsNew

const styles = StyleSheet.create({
  container: {
    padding: 8,
    maxWidth: 500,
    width: '100%',
    marginHorizontal: 'auto'
  }
})
