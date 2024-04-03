import React, { ReactNode, useState } from 'react'
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import theme from '../theme'

export type Tab = {
  title: string
  content: ReactNode
  show?: boolean
}

export type TabsProps = { tabs: Tab[]; defaultTab?: string }

const TabsA = ({ tabs = [], defaultTab }: TabsProps) => {
  const [selectedTab, setSelectedTab] = useState(defaultTab || tabs[0]?.title)
  const visibleTabs = tabs.filter(({ show }) => show)
  const handleTabPress = (tab) => {
    setSelectedTab(tab)
    // const visibleTabs = tabs.filter(({ show }) => show)
    const tabIndexSelected = visibleTabs.findIndex(({ title }) => title === tab)
    setScrollWidth((100 / visibleTabs.length) * (tabIndexSelected + 1))
  }
  const [scrollWidth, setScrollWidth] = useState(100 / tabs.length)

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <View
          style={{
            height: 2,
            marginRight: `${100 - scrollWidth}%`,
            backgroundColor: theme.info
          }}
        ></View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBar}
        >
          {visibleTabs.map((tab) => (
            <Pressable
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
    backgroundColor: 'transparent'
  },
  tabsContainer: {
    maxHeight: 50, // Ajusta esta altura según tu diseño
    backgroundColor: 'transparent'
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    maxWidth: '100%', // Esto establece el ancho máximo del ScrollView
    width: '100%' // Esto establece el ancho del ScrollView
  },
  tabButton: {
    paddingHorizontal: 10, // Reducir el padding horizontal
    paddingVertical: 5, // Reducir el padding vertical
    borderRadius: 5,
    width: 100 // Ajusta el ancho de cada botón
  },
  selectedTab: {
    backgroundColor: '#ccc'
  },
  tabButtonText: {
    fontSize: 16,
    textAlign: 'center'
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
