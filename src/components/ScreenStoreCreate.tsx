import { ScrollView, View } from 'react-native'
import { useAuth } from '../contexts/authContext'
import { ServiceStores } from '../firebase/ServiceStore'
import { reloadApp } from '../libs/reloadApp'
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import { FormStoreE } from './FormStore'

const ScreenCreateStore = ({ navigation }) => {
	const { handleSetStoreId } = useAuth()
	return (
		<ScrollView>
			<View style={gStyles.container}>
				<FormStoreE
					onSubmit={async values => {
						return await ServiceStores.create(values)
							.then(async res => {
								if (res.res.id) {
									await handleSetStoreId(res.res.id)
									await reloadApp()
								}
							})
							.catch(console.error)
							.finally(() => {
								//updateUserStores()
								navigation.goBack()
							})
					}}
				/>
			</View>
		</ScrollView>
	)
}

export default function (props) {
	return (
		<ErrorBoundary componentName="ScreenCreateStore" {...props}>
			<ScreenCreateStore {...props} />
		</ErrorBoundary>
	)
}
