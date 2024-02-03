import { StyleSheet, View } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import SectionDetails from './SectionDetails'

const ScreenSectionsDetails = ({ navigator, route }) => {
  const { storeSections } = useStore()
  const sectionId = route.params?.sectionId
  const section = storeSections.find((s) => s.id === sectionId)
  return (
    <View style={styles.container}>
      <SectionDetails section={section} />
    </View>
  )
}

export default ScreenSectionsDetails

const styles = StyleSheet.create({
  container: {
    padding: 8,
    maxWidth: 500,
    width: '100%',
    marginHorizontal: 'auto'
  }
})
