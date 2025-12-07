import { ScrollView, StyleSheet, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import useCategories from '../hooks/useCategories'
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import FormCategory from './FormCategory'

const ScreenCategoryEdit = ({ navigation, route }) => {
	const categoryId = route.params.id
	const { categories } = useStore()
	const { updateCategory } = useCategories()
	const category = categories?.find(c => c.id === categoryId)
	if (!category) return null
	return (
		<ScrollView>
			<View style={gStyles.container}>
				<FormCategory
					defaultValues={category}
					onSubmit={async values => {
						await updateCategory(categoryId, values)
						navigation.goBack()
					}}
				/>
			</View>
		</ScrollView>
	)
}

export default function ({ ...props }: { navigation: any; route: any }) {
	return (
		<ErrorBoundary componentName="ScreenCategoryEdit">
			<ScreenCategoryEdit {...props} />
		</ErrorBoundary>
	)
}

const styles = StyleSheet.create({})
