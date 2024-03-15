import RNPickerSelect from 'react-native-picker-select'
import { gStyles } from '../styles'
import { useEffect, useState } from 'react'

export type SelectOptions = {
  label: string
  value: string
}[]

const InputSelect = ({
  options = [],
  onChangeValue,
  selectedValue
}: {
  options?: SelectOptions
  onChangeValue?: (value) => void
  selectedValue?: string
}) => {
  const [defaultValue, setDefaultValue] = useState<string | null>()
  useEffect(() => {
    if (selectedValue) setDefaultValue(selectedValue)
  }, [])
  return (
    <RNPickerSelect
      // value={selectedValue}
      value={defaultValue}
      style={{
        inputWeb: gStyles.inputStyle
      }}
      onValueChange={onChangeValue}
      items={options}
      placeholder={{ label: 'Seleccionar', value: '' }}
    />
  )
}

export default InputSelect
