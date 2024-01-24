import { StyleSheet, TextInput, TextInputProps } from 'react-native'
import theme from '../theme'

/**
 * Componente de entrada de texto estilizado.
 *
 * @param {TextInputProps} props - Propiedades del componente TextInput.
 * @returns {JSX.Element} - Elemento JSX que representa el componente StyledTextInput.
 */
const StyledTextInput = ({ ...props }: TextInputProps) => {
  return <TextInput {...props} style={[styles.inputStyle, props.style]} />
}

export default StyledTextInput
const placeholderOpacity = 'bb'
const styles = StyleSheet.create({
  inputStyle: {
    borderWidth: 1,
    borderColor: theme.colors.lightgrey,
    borderRadius: theme.borderRadius.md,
    padding: theme.padding.sm,
    marginVertical: theme.margin.sm,
    width: '100%',
    placeholderTextColor: theme.colors.black + placeholderOpacity // Set placeholder text color to transparent
  }
})
