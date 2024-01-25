import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '../contexts/authContext'

import PhoneLogin from './PhoneLogin'
import Button from './Button'
import { ServiceStores } from '../firebase/ServiceStore'
import theme from '../theme'
import { useStore } from '../contexts/storeContext'
import { logout } from '../firebase/auth'
import useTheme from '../hooks/useTheme'
import P from './P'
import H1 from './H1'

const ScreenProfile = ({ navigation }) => {
  const { user } = useAuth()
  const { theme } = useTheme()
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
      <H1 size="lg">Tiendas</H1>
      <View>
        {stores.map((store) => (
          <View style={styles.store} key={store.id}>
            <Button
              onPress={() => {
                handleSetStoreId(store.id)
                navigation.navigate('Store')
              }}
              buttonStyles={{
                marginVertical: 6,
                borderWidth: 2,
                borderColor: storeId === store.id ? theme.black : 'transparent'
                // backgroundColor: theme.colors.secondary,
              }}
            >
              {store.name}
            </Button>
          </View>
        ))}
      </View>

      {user?.canCreateStore && (
        <View style={styles.buttons}>
          <Button
            onPress={() => {
              navigation.navigate('CreateStore')
            }}
            variant="outline"
          >
            Crear tienda
          </Button>
        </View>
      )}
      <View style={styles.buttons}>
        <Button
          onPress={() => {
            logout()
          }}
          variant="outline"
          color="error"
        >
          Cerrar sesión
        </Button>
      </View>
    </View>
  )
}

export default ScreenProfile

const styles = StyleSheet.create({
  store: {
    marginVertical: 6
  },
  buttons: { justifyContent: 'center', alignItems: 'center', marginVertical: 6 }
})
