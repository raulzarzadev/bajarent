import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'

const ProductImage = ({ style, src }) => {
  const modal = useModal({ title: 'Imagen de producto' })
  const source = require(`/assets/tabla.webp`)
  return (
    <View>
      <Pressable onPress={modal.toggleOpen}>
        <Image source={source} style={[style, styles.image]} />
      </Pressable>
      <StyledModal {...modal} />
    </View>
  )
}

export default ProductImage

const styles = StyleSheet.create({
  image: {}
})
