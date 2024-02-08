import React, { useState, useEffect } from 'react'
import { Image, View, Platform, Pressable, Text } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { uploadFile } from '../firebase/files'

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
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    console.log(result)

    if (!result.canceled) {
      const uri = result.assets[0].uri
      setImage(uri)
      // Convertir la URI de la imagen en un Blob
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

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {progress === -1 && <Text>Error al subir archivo</Text>}
      {progress > 0 && <Text>{progress}%</Text>}
      <Pressable
        onPress={pickImage}
        style={{
          width: '100%',
          padding: 4,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={{ textAlign: 'center' }}>{label}</Text>
        {!!image && (
          <Image
            source={{ uri: image }}
            style={{ width: '100%', minHeight: 200 }}
          />
        )}
      </Pressable>
    </View>
  )
}
