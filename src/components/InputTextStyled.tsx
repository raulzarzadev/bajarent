import { StyleSheet, TextInput, TextInputProps, View, Text } from 'react-native'
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
  ...props
}: TextInputProps & {
  disabled?: boolean
  helperText?: string
  helperTextColor?: 'error' | 'primary' | 'black' | 'white'
}): JSX.Element => {
  return (
    <View>
      <TextInput
        {...props}
        editable={!disabled}
        style={[
          baseStyle.inputStyle,
          disabled && { opacity: 0.5 },
          props.style
        ]}
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
