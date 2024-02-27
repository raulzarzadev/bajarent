import { Pressable, Text, View } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import Icon from './Icon'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../contexts/authContext'

const MyStaffLabel = () => {
  const { user } = useAuth()
  const { myStaffId, staff, store } = useStore()
  const label = staff?.find((s) => s.id === myStaffId)?.position
  const navigation = useNavigation()
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Pressable
        style={{
          flexDirection: 'row'
        }}
        onPress={() => {
          // @ts-ignore
          navigation.navigate('Store')
        }}
      >
        <Text style={[gStyles.h1, { marginRight: 16 }]}>{store?.name}</Text>
      </Pressable>
      <Pressable
        style={{
          minWidth: 100,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onPress={() => {
          // @ts-ignore
          navigation.navigate('Profile')
        }}
      >
        {user && <Icon icon={label ? `profileFill` : 'profile'} />}
        {user === null && <Icon icon="profileAdd" />}
        <Text style={[gStyles.helper, { marginRight: 8 }]}>{label}</Text>
      </Pressable>
    </View>
  )
}

export default MyStaffLabel
