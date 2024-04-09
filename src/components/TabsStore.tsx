import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Tabs from './Tabs'
import Stats from './Stats'

const TabsStore = (props) => {
  return (
    <View style={{ maxWidth: '100%' }}>
      <Tabs
        defaultTab="Tienda"
        tabs={[
          {
            title: 'Comentarios',
            // content: <ScreenStoreDetails {...props} />,
            content: <Text>Buenos dias</Text>,
            show: true
          },
          {
            title: 'Reportes',
            // content: <ScreenStoreDetails {...props} />,
            content: <Text>Buenos dias</Text>,
            show: true
          },
          {
            title: 'Gráficas',
            content: <Stats {...props} />,
            show: true
          },
          {
            title: 'Config',
            // content: <ScreenStoreDetails {...props} />,
            content: <Text>Buenos dias</Text>,
            show: true
          }
        ]}
      />
    </View>
  )
}

export default TabsStore

const styles = StyleSheet.create({})
