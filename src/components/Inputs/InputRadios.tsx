import { View, Text } from 'react-native'
import React from 'react'
import InputCheckbox from '../InputCheckbox'
import { IconName } from '../Icon'

type InputRadioOption<T = string> = {
  label: string
  value: T
  color?: string
  disabled?: boolean
  iconLabel?: IconName
}
type InputRadiosProps<T = string> = {
  label?: string
  options: InputRadioOption<T>[]
  optionStyle?: any
  textStyle?: any
  layout?: 'row' | 'column'
  value?: T
  onChange?: (value: T) => void
}
const InputRadios = <T extends string = string>({
  label,
  options,
  optionStyle,
  textStyle,
  layout = 'row',
  onChange,
  value
}: InputRadiosProps<T>) => {
  const [_value, _setValue] = React.useState<T>(value)
  const handleChooseOpt = (value: T) => {
    _setValue(value)
    onChange?.(value)
  }

  return (
    <View
      style={{
        width: '100%'
      }}
    >
      {label && <Text>{label}</Text>}
      <View
        style={{
          flexDirection: layout === 'row' ? 'row' : 'column',
          justifyContent: 'space-between'
        }}
      >
        {options.map((option, i) => (
          <InputCheckbox
            key={i}
            value={_value === option.value}
            label={option.label}
            setValue={() => handleChooseOpt(option.value)}
            color={option.color}
            disabled={option.disabled}
            // iconLabel={option.iconLabel}
            style={optionStyle}
            textStyle={textStyle}
            iconCheck={option.iconLabel}
          ></InputCheckbox>
        ))}
      </View>
    </View>
  )
}

export default InputRadios
