import RNPickerSelect from 'react-native-picker-select'
import { gStyles } from '../styles'
import { ViewStyle } from 'react-native'
import theme from '../theme'
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
  placeholder = 'Seleccionar ...'
}: {
  options?: SelectOptions
  onChangeValue?: (value) => void
  value?: string
  style?: ViewStyle
  placeholder?: string
}) => {
  return (
    <RNPickerSelect
      value={value}
      style={{
        inputWeb: [
          gStyles.inputStyle,
          { backgroundColor: 'transparent', color: theme.placeholder },
          style
        ]
      }}
      onValueChange={onChangeValue}
      items={options}
      placeholder={{ label: placeholder, value: '' }}
    />
  )
}

export default InputSelect
