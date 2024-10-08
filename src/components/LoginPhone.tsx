import { Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Button from './Button'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth } from '../firebase/auth'
import PhoneInput from './InputPhone'
import theme from '../theme'
import { fbErrorToCode } from '../firebase/errors'
import InputCode from './InputCode2'
import ups_text from '../../Constants.ts/ups_text'

const PhoneLogin = () => {
  const [phone, setPhone] = React.useState('')
  const [code, setCode] = React.useState('')
  const [msmSent, setMsmSent] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [sending, setSending] = React.useState(false)

  useEffect(() => {
    // @ts-ignore
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
      size: 'invisible',
      callback: (response) => {
        console.log('sms sent')
        //console.log({ response })
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // console.log(response)
        // onSignInSubmit()
      }
    })

    // const recaptchaResponse = grecaptcha.getResponse(recaptchaWidgetId)
  }, [])

  const onSendCode = () => {
    setSending(true)
    // @ts-ignore
    window.confirmationResult
      .confirm(code)
      .then((result) => {
        console.log('code sent')
        // User signed in successfully.
        // console.log(result)
        // console.log({ user })
        // ...
      })
      .catch((error) => {
        setError(
          `${ups_text} Codigo:  ${fbErrorToCode(error).code} ${
            __DEV__ ? fbErrorToCode(error).text : ''
          }`
        )

        // User couldn't sign in (bad verification code?)
        // ...
      })
      .finally(() => {
        setSending(false)
      })
  }

  const onSignInSubmit = async () => {
    setSending(true)
    // TODO: CREATE SIGN IN FOR ANDROID AND IOS
    if (Platform.OS === 'web') {
      // @ts-ignore
      const appVerifier = window.recaptchaVerifier
      // console.log({ appVerifier })
      signInWithPhoneNumber(auth, phone, appVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          // @ts-ignore
          window.confirmationResult = confirmationResult
          setMsmSent(true)
          //  console.log({ confirmationResult })

          // * ... redirect to ConfirmCode
        })
        .catch((error) => {
          // Error; SMS not sent
          // ...
          setError(
            `${ups_text} Codigo:  ${fbErrorToCode(error).code} ${
              __DEV__ ? fbErrorToCode(error).text : ''
            }`
          )
        })
        .finally(() => {
          setSending(false)
        })
    }
  }

  const validPhone = phone.length === 13

  return (
    <View style={{ padding: 4 }}>
      {!msmSent && (
        <>
          <Text style={styles.title}>Registrate con tu teléfono celular</Text>
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
              <Button
                onPress={onSignInSubmit}
                disabled={!validPhone || sending}
              >
                Enviar
              </Button>
            </View>
            <Button
              onPress={() => {
                setMsmSent(true)
              }}
              // disabled={sending}
              label="tengo un codigo"
              variant="ghost"
            ></Button>
            <View style={{ position: 'relative' }} id="sign-in-button"></View>
          </View>
        </>
      )}

      {!!msmSent && (
        <>
          <Text style={styles.title}>
            Ingresa el codigo que te enviamos por SMS
          </Text>
          <View style={styles.form}>
            <View style={styles.item}>
              <InputCode value={code} setValue={setCode} codeLength={6} />
            </View>
            {!!error && (
              <View>
                <Text style={{ textAlign: 'center', color: theme.error }}>
                  {error}
                </Text>
              </View>
            )}
            <View style={styles.item}>
              <Button
                onPress={onSendCode}
                disabled={sending}
                label="Envíar"
              ></Button>
            </View>
            <View style={styles.item}>
              <Button
                onPress={() => {
                  setMsmSent(false)
                  setCode('')
                }}
                disabled={sending}
                label="atras"
                variant="ghost"
              ></Button>
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
