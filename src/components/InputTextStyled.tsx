import {
  StyleSheet,
  TextInput,
  TextInputProps,
  Text,
  View,
  ViewStyle
} from 'react-native'
import theme, { BORDER_RADIUS, PADDING } from '../theme'
import { useEffect, useState } from 'react'

/**
 * Componente de entrada de texto estilizado.
 *
 * @param {TextInputProps} props - Propiedades del componente TextInput.
 * @returns {JSX.Element} - Elemento JSX que representa el componente InputTextStyledText.
 */

export type InputTextProps = Omit<TextInputProps, 'value'> & {
  value?: string | number
  disabled?: boolean
  helperText?: string
  helperTextColor?: 'error' | 'primary' | 'black' | 'white'
  type?: 'number' | 'text'
  containerStyle?: ViewStyle
}
const InputTextStyled = ({
  disabled,
  helperText,
  helperTextColor,
  type = 'text',
  value: defValue,
  containerStyle,
  ...props
}: InputTextProps): JSX.Element => {
  const [value, setValue] = useState<string | number>()
  useEffect(() => {
    setValue(defValue)
  }, [defValue])
  return (
    <View style={containerStyle}>
      <TextInput
        {...props}
        value={String(value || '')}
        style={[
          baseStyle.inputStyle,
          disabled && { opacity: 0.5 },
          props.style
        ]}
        onChangeText={(text) => {
          if (text === '') {
            setValue('')
            return props?.onChangeText?.('')
          }
          if (type === 'number') {
            let numericText = text.replace(/[^0-9.]/g, '')
            const decimalPointIndex = numericText.indexOf('.')
            if (decimalPointIndex !== -1) {
              const beforeDecimalPoint = numericText.slice(
                0,
                decimalPointIndex + 1
              )
              const afterDecimalPoint = numericText.slice(decimalPointIndex + 1)
              const sanitizedAfterDecimalPoint = afterDecimalPoint.replace(
                /\./g,
                ''
              )
              numericText = beforeDecimalPoint + sanitizedAfterDecimalPoint
            }
            setValue(numericText) // Actualiza el estado aquí
            return props?.onChangeText?.(numericText)
          } else {
            setValue(text) // Actualiza el estado aquí
            return props?.onChangeText?.(text)
          }
        }}
      />
      {!!helperText && (
        <Text style={[baseStyle.helperText, { color: helperTextColor }]}>
          {helperText}
        </Text>
      )}
    </View>
  )
}

export default InputTextStyled
const placeholderOpacity = 'ee'
const baseStyle = StyleSheet.create({
  helperText: {
    fontSize: 10,
    opacity: 0.7,
    color: theme?.black
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: theme.neutral,
    borderRadius: BORDER_RADIUS * 1.8,
    padding: PADDING * 3,
    width: '100%',
    placeholderTextColor: 'lightgrey' + placeholderOpacity // Set placeholder text color to transparent
  }
})
