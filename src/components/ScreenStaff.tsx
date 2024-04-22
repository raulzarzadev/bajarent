import { ActivityIndicator, ScrollView, View } from 'react-native'
import React from 'react'
import Button from './Button'
import ListStaff from './ListStaff'
import { gStyles } from '../styles'
import { useAuth } from '../contexts/authContext'

const ScreenStaff = ({ navigation }) => {
  const {
    store: { staff }
  } = useAuth()

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
