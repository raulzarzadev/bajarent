import { Image, Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import useModal from '../hooks/useModal'

const ItemImage = ({ style, src }) => {
	const modal = useModal({ title: 'Imagen de producto' })
	const source = require(`/assets/tabla.webp`)
	return (
		<View>
			<Pressable onPress={modal.toggleOpen}>
				<Image source={src || source} style={[style, styles.image]} />
			</Pressable>
			{/* <StyledModal {...modal} /> */}
		</View>
	)
}

export default ItemImage

const styles = StyleSheet.create({
	image: {}
})
