import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import { useAuth } from '../contexts/authContext'
import PhoneLogin from './LoginPhone'
import Button from './Button'
import { logout } from '../firebase/auth'
import CardUser from './CardUser'
import useLocation from '../hooks/useLocation'
import { Icon } from 'react-native-elements'
import ChangeStaffPosition from './ChangeStaffPosition'
import ErrorBoundary from './ErrorBoundary'
import LoginEmail from './LoginEmail'

const ScreenProfile = ({ navigation }) => {
  const { user } = useAuth()
  const { locationEnabled } = useLocation()
  if (user === undefined) return <ActivityIndicator />
  if (user === null)
    return (
      <>
        <PhoneLogin />
        {__DEV__ && <LoginEmail />}
      </>
    )
  return (
    <View style={{ padding: 2 }}>
      <Pressable>
        {locationEnabled ? (
          <Icon name="location-on" />
        ) : (
          <Icon name="location-off" />
        )}
      </Pressable>
      <ErrorBoundary componentName="CardUser">
        <CardUser user={user} />
      </ErrorBoundary>

      <ErrorBoundary componentName="ChangeStaffPosition">
        <ChangeStaffPosition />
      </ErrorBoundary>

      {user?.canCreateStore && (
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
