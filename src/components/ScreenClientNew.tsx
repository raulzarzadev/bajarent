import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import { ServiceStoreClients } from '../firebase/ServiceStoreClients2'
import { useStore } from '../contexts/storeContext'
import { FormClientE } from './FormClient'
import { gStyles } from '../styles'

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
