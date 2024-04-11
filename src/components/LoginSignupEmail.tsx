import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import InputTextStyled from './InputTextStyled'
import Button from './Button'
import { createUserWithPassword } from '../firebase/auth'
import { gStyles } from '../styles'

const LoginSignUpEmail = () => {
  const [form, setForm] = useState({ email: '', password: '', name: '' })

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
  }

  const handleSubmit = () => {
    createUserWithPassword({
      email: form.email,
      password: form.password,
      name: form.name
    })
      .then((user) => {
        console.log({ user })
      })
      .catch((error) => {
        console.error({ error })
      })
  }

  return (
    <View style={gStyles.container} testID="form-sign-up">
      <View>
        <Text>Crear usuario</Text>
      </View>
      <View style={{ margin: 4 }}>
        <InputTextStyled
          onChangeText={(value) => handleChange('name', value)}
          placeholder="Nombre"
        ></InputTextStyled>
      </View>
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

export default LoginSignUpEmail

const styles = StyleSheet.create({})
