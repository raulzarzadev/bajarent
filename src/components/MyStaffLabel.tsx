import { Dimensions, Pressable, Text, View } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import Icon from './Icon'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../contexts/authContext'

const MyStaffLabel = () => {
  const { user } = useAuth()
  const { myStaffId, staff, store } = useStore()
  const label = staff?.find((s) => s.id === myStaffId)?.position || user?.name
  const navigation = useNavigation()
  const maxWidth = Dimensions.get('window').width
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
        {maxWidth < 400 ? (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {store && (
              <>
                <Icon icon="store" />
                <Text style={gStyles.helper}>{store?.name}</Text>
              </>
            )}
          </View>
        ) : (
          <Text style={[gStyles.h2, { marginRight: 16 }]}>{store?.name}</Text>
        )}
      </Pressable>
      <Pressable
        style={{
          minWidth: 60,
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
        <Text numberOfLines={1} style={[gStyles.helper, { maxWidth: 80 }]}>
          {label}
        </Text>
      </Pressable>
    </View>
  )
}

export default MyStaffLabel
