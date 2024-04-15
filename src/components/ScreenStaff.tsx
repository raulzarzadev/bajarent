import { ActivityIndicator, ScrollView, View } from 'react-native'
import React from 'react'
import Button from './Button'
import { useStore } from '../contexts/storeContext'
import ListStaff from './ListStaff'
import { gStyles } from '../styles'

const ScreenStaff = ({ navigation }) => {
  const { staff } = useStore()
  if (!staff) return <ActivityIndicator />
  return (
    <ScrollView
      style={{
        width: '100%'
      }}
    >
      <View style={gStyles.container}>
        <Button
          onPress={() => {
            navigation.navigate('StaffNew')
          }}
          buttonStyles={{
            width: 140,
            margin: 'auto',
            marginVertical: 10
          }}
        >
          Agregar
        </Button>
        <ListStaff
          onPress={(staffId) => {
            navigation.navigate('StaffDetails', { staffId })
          }}
          staff={staff}
          hideActions
        />
      </View>
    </ScrollView>
  )
}

export default ScreenStaff
