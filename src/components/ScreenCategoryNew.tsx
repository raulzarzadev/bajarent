import { ScrollView, View } from 'react-native'
import useCategories from '../hooks/useCategories'
import { gStyles } from '../styles'
import FormCategory from './FormCategory'

const ScreenCategoryNew = ({ navigation }) => {
	const { createCategory } = useCategories()
	return (
		<ScrollView>
			<View style={gStyles.container}>
				<FormCategory
					onSubmit={async values => {
						await createCategory(values)
						navigation.goBack()
					}}
				/>
			</View>
		</ScrollView>
	)
}

export default ScreenCategoryNew
