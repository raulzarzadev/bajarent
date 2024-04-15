import {
  ActivityIndicator,
  Pressable,
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
import { useStore } from '../contexts/storeContext'
import { CardEmployeeE } from './CardEmployee'

const ScreenProfile = ({ navigation }) => {
  const { user } = useAuth()
  const { staff, store } = useStore()
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
  const employee = staff.find(({ userId }) => userId === user?.id)
  const isOwner = user?.id === store?.createdBy
  return (
    <ScrollView style={{ padding: 2 }}>
      <ErrorBoundary componentName="CardUser">
        <CardUser user={user} />
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

// export const CardStaff = () => {
//   const { staff, store } = useStore()
//   const { user } = useAuth()
//   const employee = staff.find(({ userId }) => userId === user?.id)
//   console.log({ staff, user, employee })
//   const isOwner = store?.createdBy === user.id
//   return (
//     <View>
//       {/* <Text>Staff</Text>
//       {isOwner && <Text style={gStyles.h2}>Dueño</Text>}
//       {employee && <CardStaff />} */}
//     </View>
//   )
// }

const styles = StyleSheet.create({
  store: {
    marginVertical: 6
  },
  buttons: { justifyContent: 'center', alignItems: 'center', marginVertical: 6 }
})
