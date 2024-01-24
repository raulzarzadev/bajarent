import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '../contexts/authContext'

import PhoneLogin from './PhoneLogin'
import Button from './Button'
import { ServiceStores } from '../firebase/ServiceStore'
import theme from '../theme'
import { useStore } from '../contexts/storeContext'
import { logout } from '../firebase/auth'

const ScreenProfile = ({ navigation }) => {
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      ServiceStores.getStoresByUserId(user.id)
        .then(setStores)
        .catch(console.error)
    }
  }, [user])

  const [stores, setStores] = React.useState([])
  const { handleSetStoreId, storeId } = useStore()

  if (user === undefined)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  if (user === null) return <PhoneLogin />
  return (
    <View style={{ padding: 2 }}>
      <Text style={{ textAlign: 'center', marginTop: 16 }}>
        Telefono: {user.phone}
      </Text>

      <View>
        <Text>Tiendas</Text>
        {stores.map((store) => (
          <Button
            onPress={() => {
              handleSetStoreId(store.id)
            }}
            styles={{
              marginVertical: 16,
              backgroundColor: theme.colors.secondary,
              borderWidth: 2,
              borderColor:
                storeId === store.id ? theme.colors.primary : 'transparent'
            }}
            key={store.id}
          >
            {store.name}
          </Button>
        ))}
      </View>

      {user?.canCreateStore && (
        <Button
          onPress={() => {
            navigation.navigate('CreateStore')
          }}
          styles={{
            marginVertical: 16
          }}
        >
          Crear tienda
        </Button>
      )}
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Button
          styles={{
            borderWidth: 1,
            borderColor: theme.colors.error,
            backgroundColor: 'transparent',
            width: 200
          }}
          onPress={() => {
            logout()
          }}
          textStyles={{ color: theme.colors.error }}
          size="sm"
        >
          Cerrar sesión
        </Button>
      </View>
    </View>
  )
}

export default ScreenProfile

const styles = StyleSheet.create({})
