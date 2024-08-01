import {
  StyleSheet,
  TextInput,
  TextInputProps,
  Text,
  View,
  ViewStyle
} from 'react-native'
import theme, { BORDER_RADIUS, PADDING } from '../theme'
import { useEffect, useState } from 'react'
import Button from './Button'
import Icon, { IconName } from './Icon'

/**
 * Componente de entrada de texto estilizado.
 *
 * @param {TextInputProps} props - Propiedades del componente TextInput.
 * @returns {JSX.Element} - Elemento JSX que representa el componente InputTextStyledText.
 */

export type HelperTextColors = 'error' | 'primary' | 'black' | 'white'
export type InputTextProps = Omit<TextInputProps, 'value'> & {
  value?: string | number
  disabled?: boolean
  helperText?: string
  helperTextColor?: HelperTextColors
  type?: 'number' | 'text'
  containerStyle?: ViewStyle
  label?: string
  innerLeftIcon?: IconName
  onLeftIconPress?: () => void
  hiddenInnerLeftIcon?: boolean
}
const InputTextStyled = ({
  disabled,
  helperText,
  helperTextColor,
  type = 'text',
  value: defValue,
  containerStyle,
  label,
  innerLeftIcon,
  onLeftIconPress,
  hiddenInnerLeftIcon,
  ...props
}: InputTextProps): JSX.Element => {
  const [value, setValue] = useState<string | number>()
  useEffect(() => {
    setValue(defValue)
  }, [defValue])
  return (
    <View style={containerStyle}>
      {label && <Text>{label}</Text>}
      <View
        style={[
          baseStyle.inputStyle,
          disabled && { opacity: 0.5 },
          props.style
        ]}
      >
        <TextInput
          {...props}
          style={[baseStyle.input]}
          editable={!disabled}
          value={String(value || '')}
          onChangeText={(text) => {
            if (text === '') {
              setValue('')
              return props?.onChangeText?.('')
            }
            if (type === 'number') {
              let numericText = text.replace(/[^0-9.]/g, '')
              const decimalPointIndex = numericText.indexOf('.')
              if (decimalPointIndex !== -1) {
                const beforeDecimalPoint = numericText.slice(
                  0,
                  decimalPointIndex + 1
                )
                const afterDecimalPoint = numericText.slice(
                  decimalPointIndex + 1
                )
                const sanitizedAfterDecimalPoint = afterDecimalPoint.replace(
                  /\./g,
                  ''
                )
                numericText = beforeDecimalPoint + sanitizedAfterDecimalPoint
              }
              setValue(numericText) // Actualiza el estado aquí
              return props?.onChangeText?.(numericText)
            } else {
              setValue(text) // Actualiza el estado aquí
              return props?.onChangeText?.(text)
            }
          }}
        />

        <View
          style={{
            width: 20,
            height: '100%',
            justifyContent: 'center',
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0
          }}
        >
          {innerLeftIcon && !onLeftIconPress && !hiddenInnerLeftIcon && (
            <Icon icon={innerLeftIcon} />
          )}
          {innerLeftIcon && onLeftIconPress && !hiddenInnerLeftIcon && (
            <Button
              justIcon
              icon={innerLeftIcon}
              onPress={onLeftIconPress}
              variant="ghost"
              size="xs"
            />
          )}
        </View>
      </View>

      {!!helperText && (
        <Text style={[baseStyle.helperText, { color: theme[helperTextColor] }]}>
          {helperText}
        </Text>
      )}
    </View>
  )
}

export default InputTextStyled
const placeholderOpacity = 'ee'
const baseStyle = StyleSheet.create({
  helperText: {
    fontSize: 10,
    opacity: 0.7,
    color: theme?.black
  },
  inputStyle: {
    borderWidth: 1,

    borderColor: theme.neutral,
    borderRadius: BORDER_RADIUS * 1.8,
    width: '100%',
    flexDirection: 'row',
    alignContent: 'center'
  },
  input: {
    flex: 1,
    padding: PADDING * 3,
    paddingRight: 20,
    placeholderTextColor: 'lightgrey' + placeholderOpacity // Set placeholder text color to transparent
  }
})
