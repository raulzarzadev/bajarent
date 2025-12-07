import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ClientType } from '../types/ClientType'
import { ServiceStoreClients } from '../firebase/ServiceStoreClients2'
import { useStore } from '../contexts/storeContext'
import { FormClientE } from './FormClient'
import Loading from './Loading'
import { gStyles } from '../styles'

const ScreenClientEdit = props => {
	const [client, setClient] = useState<Partial<ClientType>>()
	const itemId = props?.route?.params?.id
	const { storeId } = useStore()
	useEffect(() => {
		if (storeId)
			ServiceStoreClients.get({
				itemId,
				storeId
			}).then(res => {
				setClient(res)
			})
	}, [storeId])
	if (!client) return <Loading />
	return (
		<ScrollView>
			<View style={gStyles.container}>
				<FormClientE
					client={client}
					onSubmit={async values => {
						return await ServiceStoreClients.update({
							itemData: values,
							storeId: storeId,
							itemId: client.id
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

export default ScreenClientEdit

const styles = StyleSheet.create({})
