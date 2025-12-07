import { Text, View } from 'react-native'
import { gStyles } from '../styles'

const DisabledView = () => {
	return (
		<View style={[{ marginVertical: 22 }]}>
			<Text style={gStyles.h2}>Esta vista no esta disponible por ahora!</Text>
		</View>
	)
}

export default DisabledView
