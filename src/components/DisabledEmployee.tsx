import { Text, View } from 'react-native'
import { gStyles } from '../styles'

const DisabledEmployee = () => {
	return (
		<View>
			<Text style={gStyles.h2}>Usuario deshabilitado</Text>
			<Text style={[gStyles.h3, { marginVertical: 6 }]}>
				Contacta con tu admininstrador para más información
			</Text>
		</View>
	)
}

export default DisabledEmployee
