import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { signInWithPassword } from '../firebase/auth'
import { gStyles } from '../styles'
import Button from './Button'
import InputTextStyled from './InputTextStyled'

const LoginEmail = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
  }
  const handleSubmit = () => {
    signInWithPassword({
      email: form.email,
      password: form.password
    })
      .then((user) => {
        console.log({ user })
      })
      .catch((error) => {
        console.error({ error })
      })
  }
  return (
    <View style={gStyles.container}>
      <View style={{ margin: 4 }}>
        <InputTextStyled
          onChangeText={(value) => handleChange('email', value)}
          placeholder="Email"
        ></InputTextStyled>
      </View>
      <View style={{ margin: 4 }}>
        <InputTextStyled
          onChangeText={(value) => handleChange('password', value)}
          placeholder="Password"
        ></InputTextStyled>
      </View>
      <Button
        label="Enviar"
        onPress={() => {
          handleSubmit()
        }}
      ></Button>
    </View>
  )
}

export default LoginEmail
