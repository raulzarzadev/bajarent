import { useField } from 'formik'

import { Text, View } from 'react-native'
import asDate from '../libs/utils-date'
import { gStyles } from '../styles'
import { InputDateE } from './InputDate'

const FormikInputDate = ({ name, label = 'Fecha', withTime = false }) => {
	const [field, meta, helpers] = useField(name)
	return (
		<View>
			<InputDateE
				label={label}
				setValue={value => {
					helpers.setValue(value)
				}}
				value={asDate(field.value)}
				format="dd MMM yy"
				withTime={withTime}
			/>
			{meta.error && <Text style={gStyles.helperError}>{meta.error}</Text>}
		</View>
	)
}

export default FormikInputDate
