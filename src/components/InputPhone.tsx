import { useState } from 'react'
import { Text, View, type ViewStyle } from 'react-native'
import RNPhoneInput, { type ICountry } from 'react-native-international-phone-number'
import { gStyles } from '../styles'
import theme from '../theme'
import type { HelperTextColors } from './InputTextStyled'

type PhoneInputProps = {
	defaultNumber?: string
	stylesContainer?: ViewStyle
	stylesInput?: ViewStyle
	onChange?: (phoneNumber: string) => void
	helperText?: string
	label?: string
	helperTextColor?: HelperTextColors
}
export default function InputPhone({
	defaultNumber = '+52',
	stylesContainer,
	onChange = (phoneNumber: string) => console.log(phoneNumber),
	helperText,
	helperTextColor,
	label
}: // stylesInput
PhoneInputProps) {
	const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null)
	const [inputValue, setInputValue] = useState<string>('')

	function handleInputValue(phoneNumber: string) {
		setInputValue(phoneNumber)
		onChange?.((selectedCountry?.callingCode + phoneNumber).replaceAll(' ', ''))
	}

	function handleSelectedCountry(country: ICountry) {
		setSelectedCountry(country)
		onChange?.((country + inputValue).replaceAll(' ', ''))
	}

	return (
		<View style={[{ width: '100%' }, stylesContainer]}>
			{label && <Text style={{}}>{label}</Text>}
			<RNPhoneInput
				customMask={['## ## ## ## ##']}
				language="es"
				defaultValue={defaultNumber}
				value={inputValue}
				defaultCountry="MX"
				onChangePhoneNumber={handleInputValue}
				selectedCountry={selectedCountry}
				onChangeSelectedCountry={handleSelectedCountry}
				popularCountries={['MX', 'CA', 'US']}
				phoneInputStyles={{
					container: {
						height: 43 // * as the inputText height
					}
				}}
			/>
			{helperText && (
				<Text style={[gStyles.helper, { color: theme[helperTextColor] }]}>{helperText}</Text>
			)}
		</View>
	)
}
