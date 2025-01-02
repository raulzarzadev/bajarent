import { View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { useNavigation } from '@react-navigation/native'
import Button from './Button'
import { setItem } from '../libs/storage'
import { PERSISTENCE_KEY } from '../../App'
import { ModalCurrentWorkE } from './CurrentWork/ModalCurrentWork'
import { useEmployee } from '../contexts/employeeContext'
import AppVersion from './AppVersion'

const MyStaffLabel = () => {
  const { store } = useStore()
  const { disabledEmployee, permissions } = useEmployee()
  const { isAdmin, isOwner, orders } = permissions
  const canCreateNewOrders = orders?.canCreate
  const navigation = useNavigation()

  const handleClearHistory = () => {
    setItem(PERSISTENCE_KEY, '')
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <AppVersion showVersion />
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
    </View>
  )
}

export default MyStaffLabel
