import { View } from 'react-native'
import ProductCard from './CardProduct'

function ScreenHome() {
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
