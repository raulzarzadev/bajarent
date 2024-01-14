import { Pressable, Text, View } from 'react-native'

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Pressable onPress={() => navigation.navigate('Orders')}>
        <Text>Go to Orders</Text>
      </Pressable>
    </View>
  )
}

export default HomeScreen
