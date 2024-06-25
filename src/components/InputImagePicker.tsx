import React, { useState } from 'react'
import { Image, View, Text } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { uploadFile } from '../firebase/files'
import { colors } from '../theme'
import Button from './Button'

export default function InputImagePicker({
  label,
  value = null,
  setValue,
  name
}: {
  name: string
  label?: string
  value: any
  setValue: any
}) {
  const [image, setImage] = useState(value)
  const [progress, setProgress] = useState(null)

  const pickImage = async () => {
    // console.log('pickImage')

    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.canceled) {
      const uri = result.assets[0].uri
      setImage(uri)
      startProgress()
      // Convertir la URI de la imagen en un Blob
      return
      fetch(uri)
        .then((response) => response.blob())
        .then((blob) => {
          // Pasar el Blob a uploadFile
          uploadFile(blob, name, ({ progress, downloadURL }) => {
            // console.log({ progress, downloadURL })
            setProgress(progress)
            if (progress < 0) return console.error('Error uploading file')
            if (downloadURL) setValue(downloadURL)
          })
        })
      // uploadFile(result.assets[0], name, ({ progress, downloadURL }) => {
      //   console.log({ progress, downloadURL })
      // })
      // setValue(uri)
    }
  }
  console.log({ progress })

  const startProgress = () => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 100)
  }

  return (
    <View
      style={{
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
        backgroundColor: colors.transparent
      }}
    >
      {progress === -1 && (
        <Text
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            textAlign: 'center'
          }}
        >
          Error al subir archivo
        </Text>
      )}
      {progress > 0 && (
        <Text
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            textAlign: 'center'
          }}
        >
          {progress}%
        </Text>
      )}
      {/* <Pressable
        onPress={pickImage}
        style={{
          width: '100%',
          padding: 4,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          borderRadius: 4,
          backgroundColor: theme.primary,
          
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ textAlign: 'center' }}>{label}</Text>
          <Icon icon="addImage" />
        </View>
      </Pressable> */}

      {!!image && (
        <Image
          source={{ uri: image }}
          style={{
            width: '100%',
            minHeight: 200,
            opacity: progress === 100 ? 1 : 0.5
          }}
        />
      )}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: `${progress}%`,
          backgroundColor: colors.gray,
          opacity: progress === 100 ? 0 : 0.5,
          zIndex: 1
        }}
      ></View>
      <View style={{ position: 'absolute', bottom: 4 }}>
        <Button
          onPress={() => {
            pickImage()
          }}
          label={label}
          icon="addImage"
          size="xs"
        />
      </View>
    </View>
  )
}
