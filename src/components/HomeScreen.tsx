import { Pressable, Text, View } from 'react-native'

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Bienvendio a baja rent</Text>
      <Pressable
        onPress={() => {
          alert('hola')
        }}
      >
        <Text>Di hola</Text>
      </Pressable>
    </View>
  )
}

export default HomeScreen
