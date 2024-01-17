import { Pressable, Text, View } from 'react-native'
import ProductCard from './ProductCard'

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </View>
  )
}

export default HomeScreen
