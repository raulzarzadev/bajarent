import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import InputTextStyled from './InputTextStyled'
import Button from './Button'
import { signInWithPassword } from '../firebase/auth'

const LoginEmail = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
  }
  const handleSubmit = () => {
    signInWithPassword({
      email: form.email,
      password: form.password
    }).then((user) => {
      console.log({ user })
    })
  }
  return (
    <View>
      <Text>
        <InputTextStyled
          onChangeText={(value) => handleChange('email', value)}
          placeholder="Email"
        ></InputTextStyled>
        <InputTextStyled
          onChangeText={(value) => handleChange('password', value)}
          placeholder="Password"
        ></InputTextStyled>
        <Button
          label="Enviar"
          onPress={() => {
            handleSubmit()
          }}
        ></Button>
      </Text>
    </View>
  )
}

export default LoginEmail

const styles = StyleSheet.create({})
