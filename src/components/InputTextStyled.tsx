import { StyleSheet, TextInput, TextInputProps, Text } from 'react-native'
import theme, { BORDER_RADIUS, PADDING } from '../theme'

/**
 * Componente de entrada de texto estilizado.
 *
 * @param {TextInputProps} props - Propiedades del componente TextInput.
 * @returns {JSX.Element} - Elemento JSX que representa el componente InputTextStyledText.
 */
const InputTextStyled = ({
  disabled,
  helperText,
  helperTextColor,
  type = 'text',
  value,
  ...props
}: Omit<TextInputProps, 'value'> & {
  value?: string | number
  disabled?: boolean
  helperText?: string
  helperTextColor?: 'error' | 'primary' | 'black' | 'white'
  type?: 'number' | 'text'
}): JSX.Element => {
  return (
    <>
      <TextInput
        {...props}
        value={String(value)}
        editable={!disabled}
        style={[
          baseStyle.inputStyle,
          disabled && { opacity: 0.5 },
          props.style
        ]}
        onChangeText={(text) => {
          if (type === 'number') {
            const numericText = text.replace(/[^0-9]/g, '')
            if (props.onChangeText) props.onChangeText(numericText)
          } else {
            if (props.onChangeText) props.onChangeText(text)
          }
        }}
      />
      {!!helperText && (
        <Text style={[baseStyle.helperText, { color: helperTextColor }]}>
          {helperText}
        </Text>
      )}
    </>
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
