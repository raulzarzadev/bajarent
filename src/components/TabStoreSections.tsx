import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Tabs, { TabType } from './Tabs'
import StoreWorkshop from './StoreWorkshop2'
import { useStore } from '../contexts/storeContext'
import { SectionDetailsE } from './SectionDetails'

const TabStoreSections = () => {
  const { storeSections } = useStore()

  const sections: TabType[] = storeSections.map((section) => ({
    content: (
      <View style={{ marginTop: 16 }}>
        <SectionDetailsE section={section} />
      </View>
    ),
    title: section.name,
    icon: section?.icon,
    show: true
  }))

  return (
    <View style={{ marginTop: 16 }}>
      <Tabs tabs={sections} />
    </View>
  )
}

export default TabStoreSections

const styles = StyleSheet.create({})
