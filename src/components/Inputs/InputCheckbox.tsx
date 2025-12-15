import {
  Pressable,
  Text,
  type TextStyle,
  View,
  type ViewStyle
} from 'react-native'
import Icon2 from '../../icons'
import theme from '../../theme'
import Icon, { type IconName } from '../Icon'
export type InputCheckboxProps = {
  label?: string
  setValue: (value: boolean) => void
  value?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  color?: string
  disabled?: boolean
  iconCheck?: IconName
  iconLabel?: IconName
  variant?: 'ghost' | 'outline'
}
const InputCheckbox = ({
  label,
  setValue,
  value = false,
  style,
  textStyle,
  color = theme.accent,
  disabled,
  iconLabel,
  iconCheck,
  variant
}: InputCheckboxProps) => {
  const capitalizedLabel =
    label?.charAt(0)?.toUpperCase() + label?.slice(1) || ''

  const handlePress = (newState: boolean) => {
    setValue(newState) // Actualizar directamente el estado padre
  }
  return (
    <Pressable
      disabled={disabled}
      onPress={() => handlePress(!value)}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 2
        },
        style
      ]}
    >
      <View
        style={{
          opacity: disabled ? 0.4 : 1,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: color,
          borderRadius: 99,
          padding: 4,
          marginRight: 2,
          width: 24,
          height: 24,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {iconCheck ? (
          <Icon2
            name={iconCheck}
            color={value ? color : 'transparent'}
            size={16}
          />
        ) : (
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor: value ? color : 'transparent'
            }}
          />
        )}
      </View>
      {iconLabel && <Icon icon={iconLabel} color={color} size={16} />}
      <Text
        style={[
          {
            textDecorationLine: 'none',
            marginLeft: 4,
            opacity: disabled ? 0.4 : 1
            //  textTransform: 'capitalize'
          },
          textStyle
        ]}
      >
        {capitalizedLabel}
      </Text>
    </Pressable>
  )
}

export default InputCheckbox
