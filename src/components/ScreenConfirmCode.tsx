import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StyledTextInput from './StyledTextInput'
import Button from './Button'

const ScreenConfirmCode = () => {
  const [code, setCode] = React.useState('')
  const handleSendCode = () => {
    console.log({ code })
    window.confirmationResult
      .confirm(code)
      .then((result) => {
        // User signed in successfully.
        const user = result.user
        // ...
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
      })
  }
  return (
    <View>
      <Text>Confirmar codigo </Text>
      <StyledTextInput onChangeText={setCode}></StyledTextInput>
      <Button onPress={handleSendCode}>Confirmar</Button>
    </View>
  )
}

export default ScreenConfirmCode

const styles = StyleSheet.create({})
