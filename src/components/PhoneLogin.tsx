import { Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import StyledTextInput from './InputTextStyled'
import Button from './Button'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth } from '../firebase/auth'
import PhoneInput from './InputPhone'

const PhoneLogin = () => {
  const [phone, setPhone] = React.useState('')
  const [code, setCode] = React.useState('')
  const [msmSent, setMsmSent] = React.useState(false)
  const onSendCode = () => {
    //@ts-ignore
    window.confirmationResult
      .confirm(code)
      .then((result) => {
        // User signed in successfully.
        const user = result.user

        console.log({ user })
        // ...
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
      })
  }

  const onSignInSubmit = async () => {
    //TODO: CREATE SIGN IN FOR ANDROID AND IOS
    if (Platform.OS === 'web') {
      //@ts-ignore
      const appVerifier = window.recaptchaVerifier
      console.log({ appVerifier })
      signInWithPhoneNumber(auth, phone, appVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          //@ts-ignore
          window.confirmationResult = confirmationResult
          setMsmSent(true)
          console.log({ confirmationResult })

          // * ... redirect to ConfirmCode
        })
        .catch((error) => {
          // Error; SMS not sent
          // ...
          console.error(error)
        })
      return
    }
  }
  useEffect(() => {
    //@ts-ignore
    if (Platform.OS === 'web') {
      //@ts-ignore
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log(response)
          //onSignInSubmit()
        }
      })
    }

    //const recaptchaResponse = grecaptcha.getResponse(recaptchaWidgetId)
  }, [])

  return (
    <View>
      {!msmSent && (
        <>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '600',
              marginVertical: 10
            }}
          >
            Registrate con tu telefono celular
          </Text>
          {/* <StyledTextInput onChangeText={setPhone}></StyledTextInput> */}
          <PhoneInput onChange={setPhone} />
          <Button onPress={onSignInSubmit}>Enviar</Button>
          <View id="sign-in-button"></View>
        </>
      )}
      {msmSent && (
        <>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '600',
              marginVertical: 10
            }}
          >
            Ingresa el codigo que te enviamos por SMS
          </Text>
          <StyledTextInput onChangeText={setCode}></StyledTextInput>
          <Button onPress={onSendCode}>Enviar</Button>
        </>
      )}
    </View>
  )
}

export default PhoneLogin

const styles = StyleSheet.create({})
