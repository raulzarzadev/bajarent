import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'

const ImagePreview = ({
  image,
  title = 'Imagen',
  width = 150,
  height = 150
}) => {
  const modal = useModal({ title: title })
  if (!image) return <></>
  return (
    <>
      <Pressable onPress={modal.toggleOpen}>
        <Image
          source={{ uri: image }}
          style={{
            flex: 1,
            minHeight: 150,
            marginVertical: 2,
            width,
            height
          }}
        />
      </Pressable>
      <StyledModal {...modal}>
        <Image
          source={{ uri: image }}
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            marginVertical: 2,
            minHeight: 350,
            minWidth: 150
          }}
        />
      </StyledModal>
    </>
  )
}

export default ImagePreview

const styles = StyleSheet.create({})
