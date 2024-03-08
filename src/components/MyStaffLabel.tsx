import { Dimensions, Pressable, Text, View } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import Icon from './Icon'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../contexts/authContext'
import LocationStatus from './LocationStatus'

const MyStaffLabel = () => {
  const { user } = useAuth()
  const { myStaffId, staff, store } = useStore()
  const label = staff?.find((s) => s.id === myStaffId)?.position || user?.name
  const navigation = useNavigation()
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {user && <LocationStatus />}
      {!!store && !!label && <StoreTopButton />}
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
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <Text numberOfLines={1} style={[gStyles.helper, { maxWidth: 80 }]}>
            {label}
          </Text>
        </View>
      </Pressable>
    </View>
  )
}

const StoreTopButton = () => {
  const maxWidth = Dimensions.get('window').width
  const navigation = useNavigation()
  const { store } = useStore()
  return (
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
        <View
          style={{
            justifyContent: 'center',
            alignContent: 'center'
          }}
        >
          <Icon icon="store" />
          <Text style={[gStyles.helper]}>{store?.name}</Text>
        </View>
      )}
    </Pressable>
  )
}

export default MyStaffLabel
