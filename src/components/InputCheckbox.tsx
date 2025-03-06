import { Pressable, Text, TextStyle, View, ViewStyle } from 'react-native'
import Icon, { IconName } from './Icon'
import theme from '../theme'

const InputCheckbox = ({
  label,
  setValue,
  value = false,
  style,
  textStyle,
  color = theme.success,
  disabled,
  iconLabel,
  iconCheck
}: {
  label?: string
  setValue: (value: boolean) => void
  value?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  color?: string
  disabled?: boolean
  iconCheck?: IconName
  iconLabel?: IconName
}) => {
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
          paddingRight: 2
        },
        style
      ]}
    >
      <View
        style={{
          opacity: disabled ? 0.4 : 1,
          backgroundColor: value ? color : theme.white,
          borderWidth: 1,
          borderColor: value ? theme.white : color,
          borderRadius: 99,
          padding: 2,
          marginRight: 2,
          width: 20,
          height: 20,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Icon
          icon={iconCheck || 'done'}
          color={value ? theme.white : color}
          size={16}
        />
      </View>
      {iconLabel && <Icon icon={iconLabel} color={theme.primary} size={16} />}
      <Text
        style={[
          {
            textDecorationLine: 'none',
            marginLeft: 2
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
