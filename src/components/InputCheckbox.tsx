import { TextStyle, ViewStyle } from 'react-native'
import React, { useEffect, useState } from 'react'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import createId from '../libs/createId'
import Icon, { IconName } from './Icon'
import theme from '../theme'

const InputCheckbox = ({
  label,
  setValue,
  value = false,
  style,
  textStyle,
  color,
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
  iconLabel?: IconName
  iconCheck?: IconName
}) => {
  const componentId = createId()
  const capitalizedLabel =
    label?.charAt(0)?.toUpperCase() + label?.slice(1) || ''
  const [isChecked, setIsChecked] = useState(value)
  const [key, setKey] = useState(componentId)

  useEffect(() => {
    setIsChecked(value)
    setKey(createId())
  }, [value])

  const handlePress = (newState: boolean) => {
    setIsChecked(newState)
    setValue(newState)
  }
  return (
    <BouncyCheckbox
      key={key}
      fillColor={color}
      style={[
        // { marginHorizontal: 'auto' },
        style,
        //  disabled ? { opacity: 0.4 } : {},
        { padding: 6 }
      ]}
      iconStyle={{
        opacity: disabled ? 0.3 : 1
      }}
      textComponent={iconLabel ? <Icon icon={iconLabel} /> : undefined}
      textContainerStyle={{ marginLeft: 4 }}
      textStyle={[
        {
          textDecorationLine: 'none'
          //  textTransform: 'capitalize'
        },
        textStyle
      ]}
      // iconComponent={iconLabel ? <Icon icon={iconLabel} /> : undefined}
      iconComponent={
        iconCheck ? (
          <Icon icon={iconCheck} color={theme.white} size={20} />
        ) : undefined
      }
      innerIconStyle={{
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      isChecked={isChecked}
      disabled={disabled}
      onPress={(isChecked: boolean) => {
        handlePress(isChecked)
      }}
      text={capitalizedLabel}
    />
  )
}

export default InputCheckbox
