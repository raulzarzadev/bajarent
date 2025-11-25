import { View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import Button from './Button'
import { setItem } from '../libs/storage'
import { useEmployee } from '../contexts/employeeContext'
import useMyNav from '../hooks/useMyNav'
import { PERSISTENCE_KEY } from '../utils/navigationPersistence'

const MyStaffLabel = () => {
  const { store } = useStore()
  const { disabledEmployee, permissions } = useEmployee()
  const { isAdmin, isOwner, orders } = permissions
  const canCreateNewOrders = orders?.canCreate || isAdmin
  const { toOrders } = useMyNav()
  const handleClearHistory = () => {
    setItem(PERSISTENCE_KEY, '')
    window.location.reload()
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Button
          icon="refresh"
          onPress={() => {
            handleClearHistory()
          }}
          justIcon
          variant="outline"
          buttonStyles={{ marginRight: 12 }}
        ></Button>

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
