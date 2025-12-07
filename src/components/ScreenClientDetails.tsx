import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { ServiceStoreClients } from '../firebase/ServiceStoreClients2'
import type { ClientType } from '../types/ClientType'
import ClientDetails from './ClientDetails'
import ClientsOrders from './ClientsOrders'
import Loading from './Loading'

const ScreenClientDetails = props => {
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
		<View>
			<ClientDetails client={client} />
			<ClientsOrders clientId={client.id} />
		</View>
	)
}

export default ScreenClientDetails
