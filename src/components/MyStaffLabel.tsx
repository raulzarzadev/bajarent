import { Pressable, Text, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import Icon from './Icon'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../contexts/authContext'
import theme from '../theme'
import Button from './Button'

const MyStaffLabel = () => {
  const { user } = useAuth()
  const { myStaffId, staff, store } = useStore()
  const label = staff?.find((s) => s.id === myStaffId)?.position || user?.name
  const navigation = useNavigation()

  const routeName = navigation.getState()?.routes?.[0]?.name
  const isProfile = routeName === 'Profile'
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {/* {user && <LocationStatus />} */}
      {/* {!!store && <StoreTopButton />} */}
      {/* <Pressable
        role="button"
        id="profileButton"
        style={{
          minWidth: 60,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isProfile ? 1 : 0.5
        }}
        onPress={() => {
          // @ts-ignore
          navigation.navigate('Profile')
        }}
      >
        {user && (
          <Icon
            icon={label ? `profileFill` : 'profile'}
            color={isProfile ? theme.primary : theme.black}
          />
        )}
        {user === null && <Icon icon="profileAdd" />}
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <Text
            numberOfLines={1}
            style={[
              gStyles.helper,
              { maxWidth: 80, color: isProfile ? theme.primary : theme.black }
            ]}
          >
            {label}
          </Text>
        </View>
      </Pressable> */}
      {store && (
        <Button
          icon="add"
          onPress={() => {
            // @ts-ignore
            navigation.navigate('NewOrder')
          }}
          justIcon
          variant="outline"
          buttonStyles={{ marginRight: 12 }}
        ></Button>
      )}
    </View>
  )
}

const StoreTopButton = () => {
  const navigation = useNavigation()
  const { store } = useStore()
  const routeName = navigation.getState()?.routes?.[0]?.name
  const isStore = routeName === 'Store'

  return (
    <Pressable
      role="button"
      id="storeButton"
      style={{
        flexDirection: 'row',
        opacity: isStore ? 1 : 0.5
      }}
      onPress={() => {
        // @ts-ignore
        navigation.navigate('Store')
      }}
    >
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        {store && (
          <>
            <Icon icon="store" color={isStore ? theme.primary : theme.black} />
            <Text
              style={[
                gStyles.helper,
                { color: isStore ? theme.primary : theme.black }
              ]}
            >
              {store?.name}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  )
}

export default MyStaffLabel
