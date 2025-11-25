import { View } from 'react-native'
import Button from './Button'
import { useEmployee } from '../contexts/employeeContext'
import useMyNav from '../hooks/useMyNav'
import { useEffect, useState } from 'react'
import { useShop } from '../hooks/useShop'
import { clearNavigationState } from '../utils/navigationPersistence'

const MyStaffLabel = () => {
  const { shop } = useShop()
  const { disabledEmployee, permissions } = useEmployee()
  const { isAdmin, isOwner, orders } = permissions
  const [disabledReload, setDisabledReload] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setDisabledReload(false)
    }, 4000)
  }, [])

  const { toOrders } = useMyNav()
  const handleClearHistory = () => {
    clearNavigationState()
    window.location.reload()
  }

  const showCreateOrder = !!shop && (orders?.canCreate || isAdmin)

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Button
          disabled={disabledReload}
          icon="refresh"
          onPress={() => {
            handleClearHistory()
          }}
          justIcon
          variant="outline"
          buttonStyles={{ marginRight: 12 }}
        ></Button>

        {showCreateOrder && (
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
