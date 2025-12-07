import * as ImagePicker from 'expo-image-picker'
import pica from 'pica'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { uploadFile } from '../firebase/files'
import { gStyles } from '../styles'
import { colors } from '../theme'
import Button from './Button'
import ImagePreview from './ImagePreview'
import ProgressBar from './ProgressBar'

const MIN_SIZE = 100000
export default function InputImagePicker({
	label,
	value = null,
	setValue,
	name,
	onUploading
}: {
	name: string
	label?: string
	value: any
	setValue: any
	onUploading?: (progress: number) => void
}) {
	const [_, setImage] = useState(value)
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

			fetch(uri)
				.then(response => response.blob())
				.then(blob => {
					// Redimensionar la imagen usando pica
					// Obtener el tamaño del Blob original
					console.log('Tamaño del Blob original:', blob.size)

					if (blob.size < MIN_SIZE) {
						console.log(
							'El tamaño de la imagen es menor que el tamaño mínimo requerido. No se redimensionará.'
						)
						// Pasar el Blob original a uploadFile
						uploadFile(blob, name, ({ progress, downloadURL }) => {
							onUploading?.(progress)
							if (progress < 0) return console.error('Error uploading file')
							if (progress >= 80) setProgress(progress)
							if (downloadURL) setValue(downloadURL)
						})
						return // No proceder con el redimensionamiento
					}
					const canvas = document.createElement('canvas')
					const img = new window.Image() // Usar window.Image para crear una imagen HTML
					img.src = URL.createObjectURL(blob)

					img.onload = () => {
						const picaInstance = pica()
						// Calcular la relación de aspecto original
						const aspectRatio = img.width / img.height
						// Ajustar las dimensiones del canvas manteniendo la relación de aspecto
						const targetWidth = 300 // Puedes ajustar este valor según tus necesidades
						const targetHeight = targetWidth / aspectRatio
						canvas.width = targetWidth
						canvas.height = targetHeight

						picaInstance
							.resize(img, canvas, {
								quality: 3,
								alpha: true
							})
							.then(result => {
								return picaInstance.toBlob(result, 'image/jpeg', 0.8)
							})
							.then(resizedBlob => {
								// Obtener el tamaño del Blob redimensionado
								console.log('Tamaño del Blob redimensionado:', resizedBlob.size)

								// Pasar el Blob redimensionado a uploadFile
								uploadFile(resizedBlob, name, ({ progress, downloadURL }) => {
									onUploading?.(progress)
									if (progress < 0) return console.error('Error uploading file')
									if (progress >= 80) setProgress(progress)
									if (downloadURL) setValue(downloadURL)
								})
							})
							.catch(error => {
								console.error('Error resizing image:', error)
							})
					}
				})
			// uploadFile(result.assets[0], name, ({ progress, downloadURL }) => {
			//   console.log({ progress, downloadURL })
			// })
			// setValue(uri)
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

	return (
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
						textAlign: 'center'
					}}
				>
					Error al subir archivo
				</Text>
			)}

			<ImagePreview image={value} />
			<ProgressBar progress={progress} hideWhenFull size="lg" showPercent />
			<View
				style={{
					width: '100%'
				}}
			></View>
			<Text style={gStyles.helper}>{label}</Text>
			<Button
				onPress={() => {
					pickImage()
				}}
				// label={label}
				icon="addImage"
				size="xs"
				buttonStyles={{
					minWidth: 50,
					position: 'absolute',
					left: '50%',
					transform: [{ translateX: -25 }],
					opacity: value ? 0.4 : 1
				}}
			/>
		</View>
	)
}
