import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native'
import React from 'react'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import { colors } from '../theme'
const { height: deviceHeight } = Dimensions.get('window')

const ImagePreview = ({
  image,
  title = 'Imagen',
  width = 150,
  height = 150,
  fullscreen = false
}: {
  image: string
  title?: string
  width?: number
  height?: number
  fullscreen?: boolean
}) => {
  const modal = useModal({ title: title })
  if (!image) return <></>
  return (
    <>
      <Pressable onPress={modal.toggleOpen}>
        <Image
          source={{ uri: image }}
          style={{
            backgroundColor: colors.lightGray,
            //ligth shadow
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            borderRadius: 4,

            flex: 1,
            minHeight: height,
            marginVertical: 2,
            width,
            height,
            resizeMode: 'contain'
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
            minWidth: '100%',
            minHeight: deviceHeight - 100,
            resizeMode: 'contain',
            alignItems: 'center'
          }}
        />
      </StyledModal>
    </>
  )
}

export default ImagePreview

const styles = StyleSheet.create({})
