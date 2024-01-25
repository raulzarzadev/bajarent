import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button, { ButtonProps } from './Button'
type ButtonType = {
  variant: ButtonProps['variant']
  color: ButtonProps['color']
  title: string
}
const buttons: ButtonType[] = [
  { variant: 'filled', color: 'primary', title: 'Filled primary' },
  { variant: 'filled', color: 'secondary', title: 'Filled secondary' },
  { variant: 'filled', color: 'success', title: 'Filled success' },
  { variant: 'filled', color: 'error', title: 'Filled danger' },
  { variant: 'filled', color: 'warning', title: 'Filled warning' },
  { variant: 'filled', color: 'info', title: 'Filled info' },
  { variant: 'outline', color: 'primary', title: 'Outlined primary' },
  { variant: 'outline', color: 'secondary', title: 'Outlined secondary' },
  { variant: 'outline', color: 'success', title: 'Outlined success' },
  { variant: 'outline', color: 'error', title: 'Outlined danger' },
  { variant: 'outline', color: 'warning', title: 'Outlined warning' },
  { variant: 'outline', color: 'info', title: 'Outlined info' }
  // Agrega aquí más botones si es necesario
]

const Buttons = () => {
  return (
    <FlatList
      data={buttons}
      renderItem={({ item }) => (
        <View style={styles.buttonContainer}>
          <Button onPress={() => {}} variant={item.variant} color={item.color}>
            {item.title}
          </Button>
        </View>
      )}
      keyExtractor={(item) => item.title}
      numColumns={2} // Cambia este número para controlar cuántos botones se muestran por fila
      contentContainerStyle={styles.list}
    />
  )
}
const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 10
  },
  buttonContainer: {
    flex: 1,
    padding: 10
  }
})

export default Buttons
