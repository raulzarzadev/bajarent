import { useEffect, useRef, useState } from 'react'
import { InteractionManager, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

export type InputCodeProps = {
	value: string
	setValue: (value: string) => void
	codeLength?: number
}

const CELL_COUNT = 6

const InputCode = ({ value, setValue, codeLength = CELL_COUNT }: InputCodeProps) => {
	const [code, setCode] = useState('')
	const [containerIsFocused, setContainerIsFocused] = useState(false)

	const codeDigitsArray = new Array(codeLength).fill(0)
	const ref = useRef(null)

	const toDigitInput = (_value: number, idx: number) => {
		const emptyInputChar = ' '
		const digit = code?.[idx] || emptyInputChar

		const isCurrentDigit = idx === code?.length
		const isLastDigit = idx === codeLength - 1
		const isCodeFull = code?.length === codeLength

		const isFocused = isCurrentDigit || (isLastDigit && isCodeFull)
		const containerStyle =
			containerIsFocused && isFocused
				? [styles.codeInputCellContainer, styles.inputContainerFocused]
				: styles.codeInputCellContainer

		return (
			<View key={idx} style={containerStyle}>
				<Text style={{}}>{digit}</Text>
			</View>
		)
	}

	const handleOnPress = () => {
		setContainerIsFocused(true)
		ref?.current?.focus()
	}

	const handleSetValue = (code: string) => {
		setValue?.(code)
		setCode?.(code)
	}

	// const handleLongPress = () => {
	//   console.log('long pressed')
	//   setCode('12345')
	// }

	const handleOnBlur = () => {
		setContainerIsFocused(false)
	}

	// Effects

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setContainerIsFocused(true)
			ref?.current?.focus()
		})
	}, [])

	return (
		<View style={styles.container}>
			<Pressable
				// onLongPress={handleLongPress}
				style={styles.inputsContainer}
				onPress={handleOnPress}
			>
				{codeDigitsArray.map(toDigitInput)}
			</Pressable>
			<TextInput
				ref={ref}
				value={code}
				onChangeText={handleSetValue}
				onEndEditing={handleOnBlur}
				keyboardType="number-pad"
				returnKeyType="done"
				textContentType="oneTimeCode"
				maxLength={CELL_COUNT}
				style={styles.hiddenCodeInput}
			/>
		</View>
	)
}

export default InputCode

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		width: '100%',
		paddingHorizontal: 10
	},
	inputsContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	inputContainerFocused: {
		borderColor: 'blue'
	},
	hiddenCodeInput: {
		position: 'absolute',
		height: 0,
		width: 0,
		opacity: 0
	},
	codeInputCellContainer: {
		height: 50,
		width: 50,
		borderRadius: 15,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: 'black',
		borderWidth: 2
	}
})
