import Button from '/src/components/Button'
import { StatusBar } from 'expo-status-bar'
import { Dimensions, StyleSheet, Text, View } from 'react-native'

export default function App() {
  const windowWidth = Dimensions.get('window').width

  return (
    <View style={styles.container}>
      <Text>Bienvenido a BajaRent 2</Text>
      <StatusBar style="auto" />
      <Button
        title="Presiona aquí"
        onPress={() => {
          alert('Has presionado el botón!')
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
