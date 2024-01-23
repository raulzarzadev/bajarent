import { View } from 'react-native'
import ProductCard from './ProductCard'

function ScreenHome({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </View>
  )
}

export default ScreenHome
