import {
  StyleSheet,
  TextInput,
  TextInputProps,
  Text,
  View,
  ViewStyle,
  Pressable
} from 'react-native'
import theme, { BORDER_RADIUS, PADDING } from '../theme'
import { useEffect, useState } from 'react'
import Icon, { IconName } from './Icon'
import { gStyles } from '../styles'
import Loading from './Loading'

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
  /**
   * @deprecated
   */
  innerLeftIcon?: IconName
  /**
   * @deprecated
   */
  hiddenInnerLeftIcon?: boolean
  /**
   * @deprecated
   */
  onLeftIconPress?: () => void
  inputStyle?: ViewStyle
  onPressLeftIcon?: (action?: IconsType) => void
  leftIcon?: IconsType
}
type IconsType = 'loading' | 'search' | 'close' | 'none'
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
  inputStyle,
  onPressLeftIcon,
  leftIcon,
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
          style={[baseStyle.input, inputStyle, { flex: 1, maxWidth: '100%' }]}
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

        <Pressable
          onPress={() => onPressLeftIcon?.(leftIcon)}
          style={({ pressed }) => {
            return {
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: pressed ? theme.info : 'transparent',
              opacity: pressed ? 0.5 : 1,
              borderEndEndRadius: BORDER_RADIUS * 1.8,
              borderTopEndRadius: BORDER_RADIUS * 1.8
            }
          }}
        >
          {leftIcon === 'loading' && <Loading size={24} />}
          {leftIcon === 'search' && (
            <Icon icon="search" size={24} color={theme.primary} />
          )}
          {leftIcon === 'close' && (
            <Icon icon="close" size={24} color={theme.error} />
          )}
        </Pressable>
      </View>

      {!!helperText && (
        <Text style={[gStyles.inputHelper, { color: theme[helperTextColor] }]}>
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
    alignContent: 'center',
    position: 'relative'
  },
  input: {
    flex: 1,
    padding: PADDING * 3,
    paddingRight: 20,
    placeholderTextColor: 'lightgrey' + placeholderOpacity // Set placeholder text color to transparent
  }
})
