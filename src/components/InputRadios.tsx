import { Dimensions, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { useMemo } from 'react'
import RadioGroup from 'react-native-radio-buttons-group'

export type InputRadioOption<T = string> = {
  label: string
  value: T
}

type InputRadiosProps<T = string> = {
  options: InputRadioOption<T>[]
  value: T
  setValue: (value: T) => void
  label?: string
  layout?: 'row' | 'column'
  containerStyle?: ViewStyle
}

const InputRadios = <T extends string = string>({
  options = [],
  setValue,
  value,
  label,
  layout,
  containerStyle
}: InputRadiosProps<T>) => {
  const radioButtons = useMemo(
    () => options.map((option) => ({ ...option, id: option.value })),
    [options]
  )

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RadioGroup
        accessibilityLabel={label}
        // layout={'row'}
        radioButtons={radioButtons}
        onPress={setValue}
        selectedId={value}
        // labelStyle={{ textTransform: 'capitalize' }}
        containerStyle={[
          containerStyle,
          {
            flexDirection: layout === 'row' ? 'row' : 'column',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }
        ]}
      />
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
