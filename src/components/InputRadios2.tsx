import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { useMemo } from 'react'
import Icon, { IconName } from './Icon'

export type InputRadioOption<T = string> = {
  label: string
  value: T
  color?: string
  icon?: IconName
  iconColor?: string
}

type InputRadiosProps<T = string> = {
  options: InputRadioOption<T>[]
  value: T
  setValue: (value: T) => void
  label?: string
  layout?: 'row' | 'column'
  containerStyle?: ViewStyle
  disabled?: boolean
}

const InputRadios = <T extends string = string>({
  options = [],
  setValue,
  value,
  label,
  layout,
  containerStyle,
  disabled
}: InputRadiosProps<T>) => {
  const capitalizeLabels = options.map((option) => ({
    ...option,
    label: option.label.charAt(0).toUpperCase() + option.label.slice(1)
  }))
  const radioButtonsOptions = useMemo(
    () =>
      capitalizeLabels.map((option) => ({
        ...option,
        id: option.value,
        disabled
      })),
    [capitalizeLabels]
  )

  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      {radioButtonsOptions.map((option, i) => (
        <View key={i}>
          <Pressable
            onPress={() => setValue(option.id)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 8
            }}
          >
            <Text>{option.label}</Text>
            {option.icon && (
              <Icon icon={option.icon} color={option.iconColor} />
            )}
          </Pressable>
        </View>
      ))}
    </View>
  )
}

export default InputRadios

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignSelf: 'center' },
  label: {
    textAlign: 'center',
    fontWeight: 'bold'
  }
})
