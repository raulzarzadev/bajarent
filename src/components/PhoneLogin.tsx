import { Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import StyledTextInput from './InputTextStyled'
import Button from './Button'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth } from '../firebase/auth'
import PhoneInput from './InputPhone'
import InputCode from './InputCode'
import theme from '../theme'

const PhoneLogin = () => {
  const [phone, setPhone] = React.useState('')
  const [code, setCode] = React.useState('')
  const [msmSent, setMsmSent] = React.useState(false)
  const [error, setError] = React.useState()
  const onSendCode = () => {
    //@ts-ignore
    window.confirmationResult
      .confirm(code)
      .then((result) => {
        // User signed in successfully.
        const user = result.user
        console.log(result)
        // console.log({ user })
        // ...
      })
      .catch((error) => {
        setError('Error al enviar el codigo')
        console.error(error)
        // User couldn't sign in (bad verification code?)
        // ...
      })
  }

  const onSignInSubmit = async () => {
    //TODO: CREATE SIGN IN FOR ANDROID AND IOS
    if (Platform.OS === 'web') {
      //@ts-ignore
      const appVerifier = window.recaptchaVerifier
      // console.log({ appVerifier })
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
          setError('Error al enviar el teléfono')
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
          // console.log(response)
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
          <Text style={styles.title}>Registrate con tu telefono celular</Text>
          {/* <StyledTextInput onChangeText={setPhone}></StyledTextInput> */}
          <View style={styles.form}>
            <View style={styles.item}>
              <PhoneInput onChange={setPhone} />
            </View>
            {!!error && (
              <View>
                <Text style={{ textAlign: 'center', color: theme.error }}>
                  {error}
                </Text>
              </View>
            )}
            <View style={styles.item}>
              <Button onPress={onSignInSubmit}>Enviar</Button>
            </View>

            <View id="sign-in-button"></View>
          </View>
        </>
      )}
      {msmSent && (
        <>
          <Text style={styles.title}>
            Ingresa el codigo que te enviamos por SMS
          </Text>
          <View style={styles.form}>
            <View style={styles.item}>
              <InputCode value={code} setValue={setCode} cellCount={6} />
            </View>
            {!!error && (
              <View>
                <Text style={{ textAlign: 'center', color: theme.error }}>
                  {error}
                </Text>
              </View>
            )}
            <View style={styles.item}>
              <Button onPress={onSendCode}>Enviar</Button>
            </View>
          </View>
        </>
      )}
    </View>
  )
}

export default PhoneLogin

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: '600',
    marginVertical: 10
  },
  form: {
    maxWidth: 400,
    width: '100%',
    margin: 'auto'
  },
  item: {
    marginVertical: 10
  }
})
