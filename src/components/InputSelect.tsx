import RNPickerSelect from 'react-native-picker-select'
import { gStyles } from '../styles'
import { Text, View, ViewStyle } from 'react-native'
import theme from '../theme'
import { HelperTextColors } from './InputTextStyled'
export type SelectOption = {
	label: string
	value: string
}
export type SelectOptions = SelectOption[]

const InputSelect = ({
	options = [],
	onChangeValue,
	style,
	value,
	placeholder = 'Seleccionar ...',
	disabled = false,
	helperText,
	helperTextColor = 'black'
}: {
	options?: SelectOptions
	onChangeValue?: (value) => void
	value?: string
	style?: ViewStyle
	placeholder?: string
	disabled?: boolean
	helperText?: string
	helperTextColor?: HelperTextColors
}) => {
	return (
		<View style={{ flexDirection: 'column', flex: 1 }}>
			<RNPickerSelect
				disabled={disabled}
				value={value}
				style={{
					inputWeb: [
						gStyles.inputStyle,
						{
							backgroundColor: 'transparent',
							color: theme.placeholder,
							flex: 1
						},
						style
					]
				}}
				onValueChange={onChangeValue}
				items={options}
				placeholder={{ label: placeholder, value: '' }}
			/>
			{!!helperText && (
				<Text style={[gStyles.inputHelper, { color: theme[helperTextColor] }]}>{helperText}</Text>
			)}
		</View>
	)
}

export default InputSelect
