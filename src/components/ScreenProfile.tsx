import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import React from 'react'
import { useAuth } from '../contexts/authContext'
import PhoneLogin from './LoginPhone'
import Button from './Button'
import { logout } from '../firebase/auth'
import CardUser from './CardUser'
import ErrorBoundary from './ErrorBoundary'
import ChooseProfile from './ChooseProfile'
import LoginSignUpEmail from './LoginSignupEmail'
import { CardEmployeeE } from './CardEmployee'
import packageJson from '../../package.json'
import { gStyles } from '../styles'

const ScreenProfile = ({ navigation }) => {
  const { user } = useAuth()
  if (user === undefined) return <ActivityIndicator />
  if (user === null)
    return (
      <ErrorBoundary componentName="FormLogin">
        <ScrollView>
          <PhoneLogin />
          {!!__DEV__ && <LoginSignUpEmail />}
        </ScrollView>
      </ErrorBoundary>
    )

  return (
    <ScrollView style={{ padding: 2 }}>
      <Text style={[gStyles.helper, { textAlign: 'right' }]}>
        {packageJson.version}
      </Text>
      <ErrorBoundary componentName="CardUser">
        <CardUser
          user={user}
          onEdit={() => {
            navigation.navigate('EditProfile')
          }}
        />
      </ErrorBoundary>
      <ErrorBoundary componentName="ChooseProfile">
        <ChooseProfile />
      </ErrorBoundary>
      <ErrorBoundary componentName="CardStaff">
        <CardEmployeeE />
      </ErrorBoundary>

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
    </ScrollView>
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
