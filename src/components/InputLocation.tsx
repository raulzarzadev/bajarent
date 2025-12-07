import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import useModal from '../hooks/useModal'
import { getCoordinates } from '../libs/maps'
import type CoordsType from '../types/CoordsType'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'
import InputMapLocation from './InputMapLocation'
import InputTextStyled from './InputTextStyled'
import StyledModal from './StyledModal'

const InputLocation = ({
	value,
	setValue,
	helperText,
	neighborhood,
	address
}: InputLocationProps) => {
	const [coords, setCoords] = useState<CoordsType>(null)
	useEffect(() => {
		if (value) {
			getCoordinates(value).then(coords => {
				setCoords(coords)
			})
		}
	}, [])

	return (
		<View>
			<Text>📍 Ubicación</Text>
			<View style={styles.group}>
				<InputTextStyled
					placeholder="Ubicación"
					value={coords ? `${coords[0]},${coords[1]}` : (value as string)}
					onChangeText={text => {
						getCoordinates(text).then(coords => {
							setValue(coords)
							setCoords(coords)
						})
					}}
					helperText={helperText}
					containerStyle={{ flex: 1 }}
				/>
				<View style={{ width: 32, height: 32, marginLeft: 4 }}>
					<ModalSelectLocation
						setValue={coords => {
							setValue(coords)
							setCoords(coords)
						}}
						value={coords}
						defaultSearch={
							neighborhood || address
								? `${address || ''}${neighborhood ? ',' + neighborhood : ''}`
								: ''
						}
					/>
				</View>
			</View>
		</View>
	)
}

export type InputLocationProps = {
	value: string | CoordsType
	setValue: (value: CoordsType) => void
	helperText?: string
	neighborhood?: string
	address?: string
}
export const InputLocationE = (props: InputLocationProps) => (
	<ErrorBoundary componentName="InputLocation">
		<InputLocation {...props} />
	</ErrorBoundary>
)

const ModalSelectLocation = ({
	setValue,
	value,
	defaultSearch
}: {
	setValue: (location: CoordsType) => void
	value: CoordsType
	defaultSearch: string
}) => {
	const modal = useModal({ title: 'Selecciona la ubicación' })
	const coords = value

	return (
		<>
			<Button
				justIcon
				icon={'map'}
				variant="ghost"
				onPress={async () => {
					modal.toggleOpen()
				}}
			/>
			<StyledModal {...modal}>
				<InputMapLocation
					setCoords={coords => {
						setValue(coords)
					}}
					defaultCoords={coords}
					defaultSearch={defaultSearch}
				/>
			</StyledModal>
		</>
	)
}

export default InputLocation

const styles = StyleSheet.create({
	group: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	icon: {
		width: 30,
		height: 30,
		borderRadius: 50,
		marginHorizontal: 10,
		alignItems: 'center'
	}
})
