import { ScrollView, StyleSheet, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { ServiceStoreClients } from '../firebase/ServiceStoreClients2'
import { gStyles } from '../styles'
import { FormClientE } from './FormClient'

const ScreenClientNew = props => {
	const { storeId } = useStore()
	return (
		<ScrollView>
			<View style={gStyles.container}>
				<FormClientE
					onSubmit={async values => {
						return await ServiceStoreClients.add({
							client: values,
							storeId: storeId
						})
							.then(() => {
								props.navigation.goBack()
							})
							.catch(console.error)
					}}
				/>
			</View>
		</ScrollView>
	)
}

export default ScreenClientNew

const styles = StyleSheet.create({})
