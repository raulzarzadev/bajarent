import RNPickerSelect from 'react-native-picker-select'
import { gStyles } from '../styles'
import { ViewStyle } from 'react-native'

export type SelectOptions = {
  label: string
  value: string
}[]

const InputSelect = ({
  options = [],
  onChangeValue,
  style,
  value
}: {
  options?: SelectOptions
  onChangeValue?: (value) => void
  value?: string
  style?: ViewStyle
}) => {
  return (
    <RNPickerSelect
      value={value}
      style={{
        inputWeb: gStyles.inputStyle,
        ...style
      }}
      onValueChange={onChangeValue}
      items={options}
      placeholder={{ label: 'Seleccionar', value: '' }}
    />
  )
}

export default InputSelect
