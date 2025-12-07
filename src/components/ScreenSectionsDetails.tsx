import { ScrollView, StyleSheet, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import Loading from './Loading'
import { SectionDetailsE } from './SectionDetails'

const ScreenSectionsDetails = ({ route }) => {
	const { sections: storeSections } = useStore()
	const sectionId = route.params?.sectionId
	const section = storeSections.find(s => s.id === sectionId)
	if (!section) return <Loading />
	return (
		<ScrollView>
			<View style={styles.container}>
				<SectionDetailsE section={section} />
			</View>
		</ScrollView>
	)
}

export default ScreenSectionsDetails

const styles = StyleSheet.create({
	container: {
		padding: 8,
		maxWidth: 500,
		width: '100%',
		marginHorizontal: 'auto'
	}
})
