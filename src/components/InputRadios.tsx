import React, { useMemo } from 'react'
import { Dimensions, StyleSheet, Text, View, type ViewStyle } from 'react-native'
import RadioGroup from 'react-native-radio-buttons-group'

export type InputRadioOption<T = string> = {
	label: string
	value: T
	color?: string
}

type InputRadiosProps<T = string> = {
	options: InputRadioOption<T>[]
	value: T
	setValue: (value: T) => void
	label?: string
	layout?: 'row' | 'column'
	containerStyle?: ViewStyle
	disabled?: boolean
}
/**
 * @deprecated use Input/InputRadios instead
 * @param param0
 * @returns
 */
const InputRadios = <T extends string = string>({
	options = [],
	setValue,
	value,
	label,
	layout,
	containerStyle,
	disabled
}: InputRadiosProps<T>) => {
	const capitalizeLabels = options.map(option => ({
		...option,
		label: option.label.charAt(0).toUpperCase() + option.label.slice(1)
	}))
	const radioButtonsOptions = useMemo(
		() =>
			capitalizeLabels.map(option => ({
				...option,
				id: option.value,
				disabled
			})),
		[capitalizeLabels]
	)

	return (
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}</Text>}
			<RadioGroup
				accessibilityLabel={label}
				radioButtons={radioButtonsOptions}
				onPress={setValue}
				selectedId={value}
				labelStyle={{ marginVertical: 8 }}
				containerStyle={[
					containerStyle,
					{
						flexDirection: layout === 'row' ? 'row' : 'column',
						justifyContent: 'center',
						flexWrap: 'wrap'
					}
				]}
			/>
		</View>
	)
}

export default InputRadios

const styles = StyleSheet.create({
	container: { justifyContent: 'center', alignSelf: 'center' },
	label: {
		textAlign: 'center',
		fontWeight: 'bold'
	}
})
