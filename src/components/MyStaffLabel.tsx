import { View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { useNavigation } from '@react-navigation/native'
import Button from './Button'
import { setItem } from '../libs/storage'
import { PERSISTENCE_KEY } from '../../App'
import { ModalCurrentWorkE } from './CurrentWork/ModalCurrentWork'
import { useEmployee } from '../contexts/employeeContext'
import useMyNav from '../hooks/useMyNav'

const MyStaffLabel = () => {
  const { store } = useStore()
  const { disabledEmployee, permissions, employee } = useEmployee()
  const { isAdmin, isOwner, orders } = permissions
  const canCreateNewOrders = orders?.canCreate || isAdmin
  const { toOrders } = useMyNav()
  const handleClearHistory = () => {
    setItem(PERSISTENCE_KEY, '')
  }
  //console.l
  // og({ store, canCreateNewOrders, permissions, employee })

  return (
    <View>
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
              toOrders({ to: 'new' })
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
