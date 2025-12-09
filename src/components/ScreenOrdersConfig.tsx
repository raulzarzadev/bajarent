import { useNavigation } from '@react-navigation/native'
import { ScrollView, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { ServiceStores } from '../firebase/ServiceStore'
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import { FormOrdersConfigE } from './FormOrdersConfig'
import Loading from './Loading'

const ScreenOrdersConfig = () => {
	const navigation = useNavigation()
	const { store } = useStore()
	const handleSubmit = async values => {
		try {
			const res = await ServiceStores.update(store.id, values)
			navigation.goBack()
			return res
		} catch (e) {
			console.error({ e })
		}
	}
	const storeOrdersConfig = {
		orderTypes: store?.orderTypes || null,
		orderFields: store?.orderFields || null,
		orderTypesContract: store?.orderTypesContract || null
	}

	if (!store) return <Loading />

	return (
		<ScrollView>
			<View style={gStyles.container}>
				<FormOrdersConfigE onSubmit={handleSubmit} defaultValues={storeOrdersConfig} />
			</View>
		</ScrollView>
	)
}

export default ScreenOrdersConfig

export const ScreenOrdersConfigE = () => (
	<ErrorBoundary componentName="ScreenOrdersConfig">
		<ScreenOrdersConfig />
	</ErrorBoundary>
)
