import { View, Text, ViewStyle } from 'react-native'
import { useField } from 'formik'
import InputSelect from './InputSelect'

const FormikInputSelect = ({
  name,
  helperText = '',
  options = [],
  label = '',
  placeholder = '',
  disabled = false,
  style,
  containerStyle
}: {
  name: string
  helperText?: string
  options?: { label: string; value: string }[]
  label?: string
  placeholder?: string
  disabled?: boolean
  style?: ViewStyle
  containerStyle?: ViewStyle
}) => {
  const [field, meta, helpers] = useField(name)
  return (
    <View style={containerStyle}>
      {!!label && <Text>{label}</Text>}
      <InputSelect
        disabled={disabled}
        placeholder={placeholder}
        value={field.value || ''}
        options={options}
        onChangeValue={(value) => {
          helpers.setValue(value)
        }}
        helperText={meta.error || helperText}
        helperTextColor={meta.error ? 'error' : 'black'}
        style={style}
      />
    </View>
  )
}

export default FormikInputSelect
