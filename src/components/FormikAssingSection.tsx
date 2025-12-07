import { useField } from 'formik'
import { StyleSheet, Text, View } from 'react-native'
import { gStyles } from '../styles'
import InputAssignSection from './InputAssingSection'

const FormikAssignSection = ({ name }) => {
	const [field, meta, helpers] = useField(name)

	return (
		<View>
			<InputAssignSection
				currentSection={field.value}
				setNewSection={async ({ sectionId }) => {
					await helpers.setValue(sectionId)
				}}
			/>
			{!!meta.error && <Text style={gStyles.helperError}>{meta.error}</Text>}
		</View>
	)
}

export default FormikAssignSection

const styles = StyleSheet.create({})
