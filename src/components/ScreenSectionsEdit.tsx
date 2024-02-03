import { StyleSheet, View } from 'react-native'
import React from 'react'
import FormSection from './FormSection'
import { ServiceSections } from '../firebase/ServiceSections'
import { useStore } from '../contexts/storeContext'

const ScreenSectionsEdit = ({ navigator, route }) => {
  const sectionId = route.params.sectionId
  const section = useStore().storeSections.find((s) => s.id === sectionId)

  return (
    <View style={styles.container}>
      <FormSection
        defaultValues={section}
        onSubmit={async (value) => {
          return await ServiceSections.update(sectionId, value)
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

export default ScreenSectionsEdit

const styles = StyleSheet.create({
  container: {
    padding: 8,
    maxWidth: 500,
    width: '100%',
    marginHorizontal: 'auto'
  }
})
