import { StyleSheet, Switch } from 'react-native'
import theme, { Colors } from '../theme'

const InputSwitch = ({
  value,
  disabled,
  setValue,
  color = 'primary',
  colorFalse = 'neutral'
}: {
  value: boolean
  disabled?: boolean
  setValue: (value: boolean) => void
  color?: Colors
  colorFalse?: Colors
}) => {
  return (
    <Switch
      disabled={disabled}
      style={{
        opacity: disabled ? 0.3 : 1
      }}
      trackColor={{
        true: theme[color],
        false: theme[colorFalse]
      }}
      onValueChange={setValue}
      value={value}
    />
  )
}

export default InputSwitch

const styles = StyleSheet.create({})
