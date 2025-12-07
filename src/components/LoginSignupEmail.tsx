import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createUserWithPassword, signInWithPassword } from '../firebase/auth'
import { gStyles } from '../styles'
import Button from './Button'
import InputTextStyled from './InputTextStyled'

const LoginSignUpEmail = () => {
	const [form, setForm] = useState({ email: '', password: '', name: '' })

	const handleChange = (field: string, value: string) => {
		setForm({ ...form, [field]: value })
	}

	const handleSignup = () => {
		createUserWithPassword({
			email: form.email,
			password: form.password,
			name: form.name
		})
			.then(user => {
				console.log({ user })
			})
			.catch(error => {
				console.error({ error })
			})
	}
	const handleLogin = () => {
		signInWithPassword({ email: form.email, password: form.password })
			.then(user => {
				console.log({ user })
			})
			.catch(error => {
				console.error({ error })
			})
	}

	return (
		<View style={gStyles.container} testID="form-sign-up">
			<View>
				<Text style={gStyles.h2}>Ingresar con email</Text>
			</View>
			<View role="form">
				<View style={{ margin: 4 }}>
					<InputTextStyled
						onChangeText={value => handleChange('name', value)}
						placeholder="Nombre"
					></InputTextStyled>
				</View>
				<View style={{ margin: 4 }}>
					<InputTextStyled
						onChangeText={value => handleChange('email', value)}
						placeholder="Email"
					></InputTextStyled>
				</View>
				<View style={{ margin: 4 }}>
					<InputTextStyled
						onChangeText={value => handleChange('password', value)}
						placeholder="Password"
					></InputTextStyled>
				</View>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-around',
						marginTop: 8
					}}
				>
					<Button
						label="Registrate"
						onPress={() => {
							handleSignup()
						}}
					></Button>
					<Button
						label="Ingresar"
						onPress={() => {
							handleLogin()
						}}
					></Button>
				</View>
			</View>
		</View>
	)
}

export default LoginSignUpEmail
