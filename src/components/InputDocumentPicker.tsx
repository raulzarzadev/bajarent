import { useState } from 'react'
import { View, Text } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import { uploadFile } from '../firebase/files'
import { colors } from '../theme'
import Button from './Button'
import ProgressBar from './ProgressBar'
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'

export default function InputDocumentPicker({
  label,
  value = null,
  setValue,
  name,
  onUploading,
  mimeTypes = ['application/pdf'], // Tipos de documentos permitidos
  fileName: initialFileName = ''
}: InputDocumentPickerProps) {
  const [document, setDocument] = useState(value)
  const [progress, setProgress] = useState(null)
  const [fileName, setFileName] = useState(initialFileName)
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: mimeTypes,
        copyToCacheDirectory: true
      })

      if (result.canceled === false) {
        const { uri, name: docName } = result.assets[0]
        setDocument(uri)
        setFileName(docName)
        startProgress()

        // Obtener el archivo como blob
        fetch(uri)
          .then((response) => response.blob())
          .then((blob) => {
            // Los documentos PDF no necesitan redimensionamiento
            // Solo subir el archivo
            uploadFile(
              blob,
              initialFileName || name,
              ({ progress, downloadURL }) => {
                onUploading?.(progress)
                if (progress < 0) return console.error('Error uploading file')
                if (progress >= 80) setProgress(progress)
                if (downloadURL) setValue(downloadURL)
              }
            )
          })
          .catch((error) => {
            console.error('Error procesando el documento:', error)
            setProgress(-1)
          })
      }
    } catch (error) {
      console.error('Error al seleccionar el documento:', error)
      setProgress(-1)
    }
  }

  const startProgress = () => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setProgress(progress)
      if (progress >= 80) {
        clearInterval(interval)
      }
    }, 100)
  }

  const INPUT_WIDTH = 120

  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 50,
          backgroundColor: colors.transparent,
          width: '100%',
          position: 'relative'
        }}
      >
        {progress === -1 && (
          <Text
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              textAlign: 'center',
              color: 'red'
            }}
          >
            Error al subir archivo
          </Text>
        )}

        {/* Mostrar nombre del documento en lugar de vista previa */}
        {value && (
          <View
            style={{
              padding: 10,
              backgroundColor: '#f0f0f0',
              borderRadius: 5,
              marginVertical: 8,
              width: INPUT_WIDTH,
              alignItems: 'center'
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={{ maxWidth: INPUT_WIDTH }}
            >
              {initialFileName || fileName || 'Documento PDF'}
            </Text>
            {/* Botón para abrir el PDF */}
            <Button
              onPress={() => {
                // Abrir el PDF si es posible
                if (value) {
                  window.open(value, '_blank')
                }
              }}
              label="Ver PDF"
              icon="openEye"
              size="xs"
              variant="ghost"
            />
          </View>
        )}

        <ProgressBar progress={progress} hideWhenFull size="lg" showPercent />
        <Text style={gStyles.helper}>{label}</Text>
        <Button
          onPress={pickDocument}
          icon="upload"
          label="Archivo PDF"
          size="xs"
          buttonStyles={{
            width: INPUT_WIDTH,
            opacity: value ? 0.8 : 1
          }}
        />
      </View>
    </>
  )
}

export type InputDocumentPickerProps = {
  name: string
  label?: string
  value: any
  setValue: any
  onUploading?: (progress: number) => void
  mimeTypes?: string[]
  fileName?: string
}
export const InputDocumentPickerE = (props: InputDocumentPickerProps) => (
  <ErrorBoundary componentName="InputDocumentPicker">
    <InputDocumentPicker {...props} />
  </ErrorBoundary>
)
