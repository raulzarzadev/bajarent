import { Pressable, Text, TextStyle, View, ViewStyle } from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
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
  /**
   * @deprecated Use `iconCheck` instead
   */
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
      style={[{ flexDirection: 'row' }, style]}
    >
      <View
        style={{
          opacity: disabled ? 0.4 : 1,
          backgroundColor: value ? color : theme.white,
          borderWidth: 1,
          borderColor: theme.primary,
          borderRadius: 99,
          padding: 2,
          marginRight: 5,
          width: 20,
          height: 20,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {value ? (
          <Icon icon={iconCheck || 'done'} color={theme.white} size={16} />
        ) : (
          <>
            {iconCheck && (
              <Icon icon={iconCheck} color={theme.primary} size={16} />
            )}
          </>
          //<Icon icon="add" color={theme.primary} size={12} />
        )}
      </View>
      <Text
        style={[
          {
            textDecorationLine: 'none'
            //  textTransform: 'capitalize'
          },
          textStyle
        ]}
      >
        {capitalizedLabel}
      </Text>
    </Pressable>
    // <BouncyCheckbox
    //   fillColor={color}
    //   style={[
    //     // { marginHorizontal: 'auto' },
    //     style,
    //     //  disabled ? { opacity: 0.4 } : {},
    //     { padding: 2 }
    //   ]}
    //   iconStyle={{
    //     opacity: disabled ? 0.3 : 1
    //   }}
    //   size={20}
    //   textComponent={iconLabel ? <Icon icon={iconLabel} /> : undefined}
    //   textContainerStyle={{ marginLeft: 4 }}
    //   textStyle={[
    //     {
    //       textDecorationLine: 'none'
    //       //  textTransform: 'capitalize'
    //     },
    //     textStyle
    //   ]}
    //   // iconComponent={iconLabel ? <Icon icon={iconLabel} /> : undefined}
    //   iconComponent={
    //     iconCheck ? (
    //       <Icon icon={iconCheck} color={theme.white} size={12} />
    //     ) : undefined
    //   }
    //   innerIconStyle={{
    //     alignContent: 'center',
    //     justifyContent: 'center',
    //     alignItems: 'center'
    //   }}
    //   isChecked={value}
    //   disabled={disabled}
    //   onPress={(isChecked: boolean) => {
    //     handlePress(isChecked)
    //   }}
    //   text={capitalizedLabel}
    // />
  )
}

export default InputCheckbox
