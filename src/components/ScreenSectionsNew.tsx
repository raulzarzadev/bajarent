import { StyleSheet, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { ServiceSections } from '../firebase/ServiceSections'
import FormSection from './FormSection'

const ScreenSectionsNew = ({ navigation }) => {
	const { storeId } = useStore()
	return (
		<View style={styles.container}>
			<FormSection
				onSubmit={async value => {
					value.storeId = storeId
					return await ServiceSections.create(value)
						.then(res => {
							console.log(res)
							navigation?.goBack()
						})
						.catch(err => {
							console.log({ err })
						})
				}}
			/>
		</View>
	)
}

export default ScreenSectionsNew

const styles = StyleSheet.create({
	container: {
		padding: 8,
		maxWidth: 500,
		width: '100%',
		marginHorizontal: 'auto'
	}
})
