import { Pressable, Text, View } from 'react-native'

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Pressable onPress={() => navigation.navigate('Orders')}>
        <Text>Go to Orders</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('NewOrder')}>
        <Text>New order</Text>
      </Pressable>
    </View>
  )
}

export default HomeScreen
