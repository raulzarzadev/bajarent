import React, { ReactNode, useState } from 'react'
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import theme from '../theme'
import { gStyles } from '../styles'

export type Tab = {
  title: string
  content: ReactNode
  show?: boolean
}

export type TabsProps = {
  tabs: Tab[]
  defaultTab?: string
  showProgressBar?: boolean
}

const TabsA = ({ tabs = [], defaultTab, showProgressBar }: TabsProps) => {
  const [selectedTab, setSelectedTab] = useState(defaultTab || tabs[0]?.title)
  const visibleTabs = tabs.filter(({ show }) => show)
  const handleTabPress = (tab) => {
    setSelectedTab(tab)
    // const visibleTabs = tabs.filter(({ show }) => show)
    const tabIndexSelected = visibleTabs.findIndex(({ title }) => title === tab)
    setScrollWidth((100 / visibleTabs.length) * (tabIndexSelected + 1))
  }
  const [scrollWidth, setScrollWidth] = useState(100 / tabs.length)
  if (visibleTabs.length === 0)
    return <Text style={gStyles.h2}>No hay tabs visibles</Text>
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBar}
        >
          {visibleTabs.map((tab) => (
            <Pressable
              role="tab"
              key={tab.title}
              style={({ pressed }) => [
                styles.tabButton,
                selectedTab === tab.title && styles.selectedTab,
                pressed && { backgroundColor: '#ddd' }
              ]}
              onPress={() => handleTabPress(tab.title)}
            >
              <Text style={styles.tabButtonText}>{tab.title}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {showProgressBar && (
          <View
            style={{
              height: 2,
              marginRight: `${100 - scrollWidth}%`,
              backgroundColor: theme.info
            }}
          ></View>
        )}
      </View>
      <View style={styles.tabContent}>
        {visibleTabs.find((tab) => tab.title === selectedTab)?.content}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    width: '100%'
  },
  tabsContainer: {
    maxHeight: 50, // Ajusta esta altura según tu diseño
    backgroundColor: 'transparent'
  },
  tabBar: {
    flexDirection: 'row',
    // justifyContent: 'space-around',// this make disappears some tabs
    alignItems: 'center',
    paddingVertical: 4,
    paddingBottom: 0,
    // maxWidth: '100%', // Esto establece el ancho máximo del ScrollView
    width: '100%', // Esto establece el ancho del ScrollView
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.2
  },
  tabButton: {
    paddingHorizontal: 10, // Reducir el padding horizontal
    paddingVertical: 5, // Reducir el padding vertical
    // borderRadius: 5,
    borderTopEndRadius: 5,
    borderTopStartRadius: 5,
    width: 130, // Ajusta el ancho de cada botón
    borderWidth: 0.2,
    borderColor: '#cccb',
    borderBottomWidth: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#f2f2f2'
  },
  selectedTab: {
    backgroundColor: '#ccc',
    shadowColor: '#f2f2f2',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.3
  },
  tabButtonText: {
    fontSize: 16,
    textAlign: 'center'
  },
  tabContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'center',
    width: '100%'
  },
  moreTabsIndicator: {
    fontSize: 16,
    marginRight: 10 // Espacio para el indicador de más pestañas
  }
})

export default function Tabs(props: TabsProps) {
  return (
    <ErrorBoundary componentName="Tabs">
      <TabsA {...props} />
    </ErrorBoundary>
  )
}
