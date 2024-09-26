import { Pressable, Text, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import Icon from './Icon'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../contexts/authContext'
import theme from '../theme'
import Button from './Button'
import { setItem } from '../libs/storage'
import { PERSISTENCE_KEY } from '../../App'
import { ModalCurrentWorkE } from './ModalCurrentWork'
import { useEmployee } from '../contexts/employeeContext'

const MyStaffLabel = () => {
  const { user } = useAuth()
  const { myStaffId, staff, store } = useStore()
  const {
    disabledEmployee,
    permissions: { isAdmin, isOwner, orders }
  } = useEmployee()
  const canCreateNewOrders = orders?.canCreate
  const label = staff?.find((s) => s.id === myStaffId)?.position || user?.name
  const navigation = useNavigation()

  const routeName = navigation.getState()?.routes?.[0]?.name
  const isProfile = routeName === 'Profile'
  const handleClearHistory = () => {
    setItem(PERSISTENCE_KEY, '')
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <ModalCurrentWorkE />
      {__DEV__ && (
        <Button
          icon="broom"
          onPress={() => {
            handleClearHistory()
          }}
          justIcon
          variant="outline"
          buttonStyles={{ marginRight: 12 }}
        ></Button>
      )}
      {store && canCreateNewOrders && (
        <Button
          //* disabled for disabledEmployees and not admin or owner
          disabled={disabledEmployee && !(isAdmin || isOwner)}
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
