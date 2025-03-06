import { View, Text, ViewStyle } from 'react-native'
import React from 'react'
import InputCheckbox from '../InputCheckbox'
import { IconName } from '../Icon'

export type InputRadioOption<T = string> = {
  label: string
  value: T
  color?: string
  disabled?: boolean
  iconLabel?: IconName
  iconCheck?: IconName
}
export type InputRadiosProps<T = string> = {
  label?: string
  options: InputRadioOption<T>[]
  //optionStyle?: any
  textStyle?: any
  layout?: 'row' | 'column'
  value?: T
  onChange?: (value: T) => void
  disabled?: boolean
  stylesContainer?: ViewStyle
  stylesRow?: ViewStyle
  stylesOption?: ViewStyle
}
const InputRadios = <T extends string = string>({
  label,
  options,
  // optionStyle,
  textStyle,
  layout = 'row',
  onChange,
  value,
  disabled,
  stylesContainer,
  stylesRow,
  stylesOption
}: InputRadiosProps<T>) => {
  const [_value, _setValue] = React.useState<T>(value)
  const handleChooseOpt = (value: T) => {
    _setValue(value)
    onChange?.(value)
  }

  return (
    <View
      style={[
        {
          width: '100%'
        },
        stylesContainer
      ]}
    >
      {label && <Text>{label}</Text>}
      <View
        style={[
          {
            flexDirection: layout === 'row' ? 'row' : 'column'
          },
          stylesRow
        ]}
      >
        {options.map((option, i) => (
          <InputCheckbox
            key={i}
            value={_value === option.value}
            label={option.label}
            setValue={() => handleChooseOpt(option.value)}
            color={option.color}
            disabled={option.disabled || disabled}
            iconLabel={option.iconLabel}
            style={stylesOption}
            textStyle={textStyle}
            iconCheck={option.iconCheck}
          ></InputCheckbox>
        ))}
      </View>
    </View>
  )
}

export default InputRadios
