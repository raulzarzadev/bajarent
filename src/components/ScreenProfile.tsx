import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuth } from '../contexts/authContext'
import PhoneLogin from './PhoneLogin'
import Button from './Button'
import { logout } from '../firebase/auth'
import CardUser from './CardUser'

const ScreenProfile = ({ navigation }) => {
  const { user } = useAuth()
  if (user === undefined) return <ActivityIndicator />
  if (user === null) return <PhoneLogin />
  return (
    <View style={{ padding: 2 }}>
      <CardUser user={user} />

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
            navigation.navigate('EditProfile')
          }}
          variant="outline"
        >
          Editar información
        </Button>
      </View>
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
