import { forwardRef, useCallback, useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle
} from 'react-native'
import { gStyles } from '../../styles'
import theme, { BORDER_RADIUS, PADDING } from '../../theme'

export type InputMoneyProps = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  value?: number
  onChangeValue?: (value: number) => void
  disabled?: boolean
  helperText?: string
  helperTextColor?: 'error' | 'primary' | 'black' | 'white'
  containerStyle?: ViewStyle
  label?: string
  inputStyle?: ViewStyle
  /** Mínimo valor permitido */
  min?: number
  /** Máximo valor permitido */
  max?: number
  /** Símbolo de moneda */
  currencySymbol?: string
  /** Decimales a mostrar (default: 2) */
  decimals?: number
}

/**
 * Formatea un número a formato de moneda (ej: 1234.56 -> "1,234.56")
 */
const formatCurrency = (value: number, decimals = 2): string => {
  if (Number.isNaN(value) || value === 0) return ''
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 * Parsea un string de moneda a número (ej: "1,234.56" -> 1234.56)
 */
const parseCurrency = (text: string): number => {
  // Remover todo excepto números y punto decimal
  const cleaned = text.replace(/[^0-9.]/g, '')
  // Manejar múltiples puntos decimales
  const parts = cleaned.split('.')
  if (parts.length > 2) {
    // Mantener solo el primer punto decimal
    const integerPart = parts[0]
    const decimalPart = parts.slice(1).join('')
    return parseFloat(`${integerPart}.${decimalPart}`) || 0
  }
  return parseFloat(cleaned) || 0
}

const InputMoney = forwardRef<TextInput, InputMoneyProps>(
  (
    {
      value: defaultValue = 0,
      onChangeValue,
      disabled,
      helperText,
      helperTextColor,
      containerStyle,
      label,
      inputStyle,
      min,
      max,
      currencySymbol = '$',
      decimals = 2,
      placeholder = '$0.00',
      ...props
    },
    ref
  ) => {
    // Estado interno para el texto mostrado
    const [displayValue, setDisplayValue] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    // Sincronizar valor externo -> display
    useEffect(() => {
      if (!isFocused) {
        setDisplayValue(
          defaultValue ? formatCurrency(defaultValue, decimals) : ''
        )
      }
    }, [defaultValue, decimals, isFocused])

    const handleChangeText = useCallback(
      (text: string) => {
        // Si está vacío
        if (!text || text === currencySymbol) {
          setDisplayValue('')
          onChangeValue?.(0)
          return
        }

        // Remover símbolo de moneda si el usuario lo escribió
        let cleanText = text.replace(currencySymbol, '').trim()

        // Solo permitir números y un punto decimal
        cleanText = cleanText.replace(/[^0-9.]/g, '')

        // Manejar múltiples puntos decimales
        const dotIndex = cleanText.indexOf('.')
        if (dotIndex !== -1) {
          const beforeDot = cleanText.slice(0, dotIndex + 1)
          const afterDot = cleanText.slice(dotIndex + 1).replace(/\./g, '')
          // Limitar decimales
          cleanText = beforeDot + afterDot.slice(0, decimals)
        }

        setDisplayValue(cleanText)

        // Parsear y validar
        const numValue = parseCurrency(cleanText)
        let finalValue = numValue

        // Aplicar límites
        if (min !== undefined && finalValue < min) {
          finalValue = min
        }
        if (max !== undefined && finalValue > max) {
          finalValue = max
        }

        onChangeValue?.(finalValue)
      },
      [currencySymbol, decimals, min, max, onChangeValue]
    )

    const handleFocus = useCallback(
      (e: any) => {
        setIsFocused(true)
        // Mostrar valor sin formato al enfocar para edición fácil
        if (defaultValue) {
          setDisplayValue(defaultValue.toString())
        }
        props.onFocus?.(e)
      },
      [defaultValue, props]
    )

    const handleBlur = useCallback(
      (e: any) => {
        setIsFocused(false)
        // Formatear al perder foco
        const numValue = parseCurrency(displayValue)
        if (numValue) {
          setDisplayValue(formatCurrency(numValue, decimals))
        } else {
          setDisplayValue('')
        }
        props.onBlur?.(e)
      },
      [displayValue, decimals, props]
    )

    const showError = helperTextColor === 'error'

    return (
      <View style={containerStyle}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View
          style={[
            styles.inputContainer,
            disabled && styles.disabled,
            isFocused && styles.focused,
            showError && styles.error
          ]}
        >
          <Text style={styles.currencySymbol}>{currencySymbol}</Text>
          <TextInput
            ref={ref}
            {...props}
            style={[styles.input, inputStyle]}
            editable={!disabled}
            value={displayValue}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={
              placeholder.replace(currencySymbol, '').trim() || '0.00'
            }
            placeholderTextColor={theme.placeholder}
            keyboardType="decimal-pad"
            selectTextOnFocus
          />
        </View>
        {!!helperText && (
          <Text
            style={[
              gStyles.inputHelper,
              { color: theme[helperTextColor || 'black'] }
            ]}
          >
            {helperText}
          </Text>
        )}
      </View>
    )
  }
)

InputMoney.displayName = 'InputMoney'

export default InputMoney

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: theme.black
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.neutral,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: PADDING,
    minHeight: 48
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: theme.neutral
  },
  focused: {
    borderColor: theme.primary,
    borderWidth: 2
  },
  error: {
    borderColor: theme.error
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.secondary,
    marginRight: 4
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: theme.black,
    paddingVertical: PADDING / 2
  }
})
