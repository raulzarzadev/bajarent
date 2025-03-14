import { View, Text, ViewStyle } from 'react-native'
import React from 'react'
import InputCheckbox from './InputCheckbox'
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
  textStyle?: any
  layout?: 'row' | 'column'
  value?: T
  onChange?: (value: T) => void
  disabled?: boolean
  stylesContainer?: ViewStyle
  stylesRow?: ViewStyle
  stylesOption?: ViewStyle
  variant?: 'ghost' | 'outline'
}

const InputRadios = <T extends string = string>({
  label,
  options,
  textStyle,
  layout = 'row',
  onChange,
  value,
  disabled,
  stylesContainer,
  stylesRow,
  stylesOption,
  variant = 'outline'
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
            flexDirection: layout === 'row' ? 'row' : 'column',
            flexWrap: 'wrap'
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
            variant={variant}
          ></InputCheckbox>
        ))}
      </View>
    </View>
  )
}

export default InputRadios
