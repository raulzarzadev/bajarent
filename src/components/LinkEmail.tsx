import React from 'react'
import { Text, TouchableOpacity, Linking } from 'react-native'

const LinkEmail = ({ email }) => {
	const handlePress = () => {
		Linking.openURL(`mailto:${email}`)
	}

	return (
		<TouchableOpacity onPress={handlePress}>
			<Text style={{ textDecorationLine: 'underline', textAlign: 'center' }}>{email}</Text>
		</TouchableOpacity>
	)
}

export default LinkEmail
