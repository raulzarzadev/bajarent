import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import { useAuth } from '../contexts/authContext'
import PhoneLogin from './LoginPhone'
import Button from './Button'
import { logout } from '../firebase/auth'
import CardUser from './CardUser'
import ErrorBoundary from './ErrorBoundary'
import LoginEmail from './LoginEmail'
import ChooseProfile from './ChooseProfile'
import { ButtonAskLocation } from './LocationStatus'

const ScreenProfile = ({ navigation }) => {
  const { user } = useAuth()
  if (user === undefined) return <ActivityIndicator />
  if (user === null)
    return (
      <ErrorBoundary componentName="FormLogin">
        <PhoneLogin />
        {!!__DEV__ && <LoginEmail />}
      </ErrorBoundary>
    )
  return (
    <View style={{ padding: 2 }}>
      <ErrorBoundary componentName="ChooseProfile">
        <ChooseProfile />
      </ErrorBoundary>

      <ErrorBoundary componentName="CardUser">
        <CardUser user={user} />
      </ErrorBoundary>

      <ButtonAskLocation />

      {!!user?.canCreateStore && (
        <View style={styles.buttons}>
          <Button
            onPress={() => {
              navigation?.navigate('CreateStore')
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
            navigation?.navigate('EditProfile')
          }}
          variant="outline"
          label="Editar información"
        ></Button>
      </View>

      <View style={styles.buttons}>
        <Button
          onPress={() => {
            logout()
          }}
          variant="outline"
          color="error"
          label="Cerrar sesión"
        ></Button>
      </View>
    </View>
  )
}

export default function (props) {
  return (
    <ErrorBoundary componentName="ScreenProfile" {...props}>
      <ScreenProfile {...props} />
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  store: {
    marginVertical: 6
  },
  buttons: { justifyContent: 'center', alignItems: 'center', marginVertical: 6 }
})
