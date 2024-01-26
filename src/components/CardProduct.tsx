import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ProductImage from './ProductImage'
import theme from '../theme'

const ProductCard = () => {
  return (
    <View style={styles.card}>
      <ProductImage style={styles.image} src={'/assets/tabla.webp'} />
      <Text>Tabla de surft</Text>
      <Text style={{ fontWeight: '800' }}>$150.00</Text>
      <Text>x1 día</Text>
    </View>
  )
}

export default ProductCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    width: 150,
    height: 250,
    alignItems: 'center'
  },
  image: {
    borderRadius: theme.borderRadius.md,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: 150,
    height: 160
  }
})
