import { StyleSheet, TextInput, TextInputProps } from 'react-native'
import theme, { BORDER_RADIUS, PADDING } from '../theme'

/**
 * Componente de entrada de texto estilizado.
 *
 * @param {TextInputProps} props - Propiedades del componente TextInput.
 * @returns {JSX.Element} - Elemento JSX que representa el componente StyledTextInput.
 */
const StyledTextInput = ({ ...props }: TextInputProps) => {
  return <TextInput {...props} style={[baseStyle.inputStyle]} />
}

export default StyledTextInput
const placeholderOpacity = 'bb'
const baseStyle = StyleSheet.create({
  inputStyle: {
    borderWidth: 1,
    borderColor: theme.neutral,
    borderRadius: BORDER_RADIUS * 1.8,
    padding: PADDING * 3,
    width: '100%',
    placeholderTextColor: theme.black + placeholderOpacity // Set placeholder text color to transparent
  }
})
