import { View, Modal, Pressable, Text, StyleSheet } from 'react-native'
import Button from './Button'
import { useEmployee } from '../contexts/employeeContext'
import useMyNav from '../hooks/useMyNav'
import { useEffect, useState } from 'react'
import { useShop } from '../hooks/useShop'
import { clearNavigationState } from '../utils/navigationPersistence'
import Loading from './Loading'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'

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

  const showCreateOrder = !!shop && (orders?.canCreate || isAdmin)

  const handleReload = () => {
    setDisabledReload(true)
    window.location.reload()
  }

  const handleClearHistory = () => {
    setDisabledReload(true)
    clearNavigationState()
    // Opcional: también recargar después de limpiar
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }
  const modal = useModal({ title: 'Menú de recarga' })

  return (
    <View>
      <StyledModal {...modal}>
        <View
          style={{
            marginVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 'auto'
          }}
        >
          <Button
            disabled={disabledReload}
            size="small"
            label="Recargar y borrar navegación"
            icon="refresh"
            onPress={handleClearHistory}
          ></Button>
        </View>
      </StyledModal>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ marginRight: 12 }}>
          {disabledReload ? (
            <Loading id="page-reloading" />
          ) : (
            <Button
              disabled={disabledReload}
              icon="refresh"
              onPress={handleReload}
              onLongPress={() => modal.toggleOpen()}
              justIcon
              variant="outline"
            ></Button>
          )}
        </View>

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
