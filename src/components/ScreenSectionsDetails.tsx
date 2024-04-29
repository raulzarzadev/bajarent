import { StyleSheet, View } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import { SectionDetailsE } from './SectionDetails'
import Loading from './Loading'

const ScreenSectionsDetails = ({ route }) => {
  const { storeSections } = useStore()
  const sectionId = route.params?.sectionId
  const section = storeSections.find((s) => s.id === sectionId)
  if (!section) return <Loading />
  return (
    <View style={styles.container}>
      <SectionDetailsE section={section} />
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
