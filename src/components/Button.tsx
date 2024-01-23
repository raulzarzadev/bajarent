import React from 'react'
import { StyleSheet, Pressable, Text } from 'react-native'

interface ButtonProps {
  onPress?: () => void
  label?: string
  children?: string
  id?: string
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  children = 'Label',
  id
}) => {
  return (
    <Pressable id={id} style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>
        <Text>{label || children}</Text>
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'gray'
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

export default Button
