import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '../contexts/authContext'
import Button from './Button'
import StyledTextInput from './StyledTextInput'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import { RecaptchaVerifier, signInWithPhoneNumber } from '@firebase/auth'
import { auth } from '../firebase/auth'
import { useNavigation } from '@react-navigation/core'

const ScreenProfile = ({ navigation }) => {
  const { user } = useAuth()

  const [phone, setPhone] = React.useState('')
  const handleAuth = () => {}
  const [code, setCode] = React.useState('')

  const handleSetCode = () => {
    // setCode
    console.log({ code })
  }

  if (user === undefined)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  if (user === null) return <Login navigation={navigation} />
  return (
    <View>
      <Text>{user?.name}</Text>
    </View>
  )
}

const Login = () => {
  const [phone, setPhone] = React.useState('')

  const onSignInSubmit = () => {
    auth.settings.appVerificationDisabledForTesting = true
    const appVerifier = window.recaptchaVerifier
    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult

        console.log({ confirmationResult })

        // * ... redirect to ConfirmCode
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
        console.error(error)
      })
  }
  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
      size: 'invisible',
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        console.log(response)
        //onSignInSubmit()
      }
    })
    //const recaptchaResponse = grecaptcha.getResponse(recaptchaWidgetId)
  }, [])
  return (
    <View>
      <Text
        style={{ textAlign: 'center', fontWeight: '600', marginVertical: 10 }}
      >
        Registrate con tu telefono celular
      </Text>
      <StyledTextInput onChangeText={setPhone}></StyledTextInput>
      <View id="sign-in-button"></View>
      <Button onPress={onSignInSubmit}>Enviar</Button>
    </View>
  )
}

export default ScreenProfile

const styles = StyleSheet.create({})
