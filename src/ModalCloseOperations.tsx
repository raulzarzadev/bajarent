import { View, Text } from 'react-native'
import React from 'react'
import useModal from './hooks/useModal'
import StyledModal from './components/StyledModal'
import Button from './components/Button'
import { useStore } from './contexts/storeContext'
import { onDownloadBackup } from './libs/downloadOrders'
import Loading from './components/Loading'
import TextInfo from './components/TextInfo'

const ModalCloseOperations = () => {
	const modal = useModal({ title: 'Respaldos' })
	const { storeId, staff, store } = useStore()
	const [loading, setLoading] = React.useState(false)
	const handleConfirmCloseOps = async () => {
		setLoading(true)

		await onDownloadBackup({
			storeId,
			storeName: store?.name || '',
			storeStaff: staff
		})
			.then(() => {
				setLoading(false)
			})
			.catch(res => console.log(res))
		modal.toggleOpen()
	}

	return (
		<View>
			<Button
				label="Respaldo"
				icon="backup"
				onPress={modal.toggleOpen}
				variant="ghost"
				size="xs"
				disabled={loading}
			></Button>
			<StyledModal {...modal}>
				<TextInfo
					defaultVisible
					type="info"
					text="Se generara archivos formato .csv (excel) con todas las ordenes
          activas el día de hoy, así como los balance en archivo .json."
				/>
				<TextInfo defaultVisible type="warning" text="Guarda estos archivos en un lugar seguro." />
				{loading && (
					<>
						<Text>Generando archivos</Text>
						<Text>No cerrar ni recargar esta página</Text>
						<Loading />
					</>
				)}
				<Button
					onPress={handleConfirmCloseOps}
					label="Confirmar "
					variant="outline"
					disabled={loading}
				></Button>
			</StyledModal>
		</View>
	)
}

export default ModalCloseOperations
