import { useEffect, useRef } from 'react'
import { View } from 'react-native'
import SignatureScreen from 'react-signature-canvas'
import useModal from '../hooks/useModal'
import Button from './Button'
import ImagePreview from './ImagePreview'
import StyledModal from './StyledModal'

const InputSignature = ({
	setValue,
	value,
	disabled,
	minHeight = 400
}: {
	setValue: (signature: string) => void
	value: string
	disabled?: boolean
	minHeight?: number
}) => {
	const ref = useRef<SignatureScreen>(null)

	const handleClear = () => {
		ref.current.clear()
	}

	const handleConfirm = () => {
		const res = ref.current.getTrimmedCanvas().toDataURL('image/png')
		setValue?.(res)
		modal.toggleOpen()
	}

	useEffect(() => {
		if (value && ref.current) {
			ref.current.fromDataURL(value)
		}
	}, [value])

	const isSigned = !!value

	const modal = useModal({ title: 'Firma' })

	return (
		<View>
			{!!value && (
				<View style={{ marginHorizontal: 'auto' }}>
					<ImagePreview image={value} title="Firma" height={100} width={100} />
				</View>
			)}
			<Button
				onPress={modal.toggleOpen}
				buttonStyles={{ margin: 'auto', marginTop: 4 }}
				label={isSigned ? 'Actualizar firma' : 'Firmar'}
				color={isSigned ? 'success' : 'primary'}
				icon="signature"
				size="xs"
				disabled={disabled}
				variant={!value ? 'ghost' : 'filled'}
			></Button>
			<StyledModal {...modal} size="full">
				<View
					style={{
						borderWidth: 3,
						borderColor: 'lightgrey',
						borderRadius: 10,
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.25,
						shadowRadius: 3.84,
						elevation: 5
					}}
				>
					<SignatureScreen
						ref={ref}
						canvasProps={{
							style: { width: '100%', minHeight }
						}}
					/>
				</View>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-evenly',
						marginTop: 8
					}}
				>
					<Button label="Borrar" onPress={handleClear} variant="ghost" size="small" />
					<Button label="Guardar" onPress={handleConfirm} icon="save" size="small" />
				</View>
			</StyledModal>
		</View>
	)
}

export default InputSignature
