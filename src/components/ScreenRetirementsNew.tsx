import { useNavigation } from '@react-navigation/native'

import { StyleSheet, Text, View } from 'react-native'
import { ServicePayments } from '../firebase/ServicePayments'
import { gStyles } from '../styles'
import FormRetirement from './FormRetirement'

const ScreenRetirementsNew = () => {
	const { goBack } = useNavigation()
	return (
		<View>
			<View style={gStyles.container}>
				<FormRetirement
					onSubmit={async values => {
						try {
							goBack()
							await ServicePayments.retirement(values)
								.then(res => {
									console.log({ res })
								})
								.catch(e => console.error({ e }))

							return
						} catch (error) {
							console.error(error)
						}
					}}
				/>
			</View>
		</View>
	)
}

export default ScreenRetirementsNew

const styles = StyleSheet.create({})
