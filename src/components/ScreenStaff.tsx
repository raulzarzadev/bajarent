import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useAuth } from '../contexts/authContext'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { ServiceStores } from '../firebase/ServiceStore'
import useModal from '../hooks/useModal'
import { useShop } from '../hooks/useShop'
import catchError from '../libs/catchError'
import { gStyles } from '../styles'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'
import ListStaff from './ListStaff2'
import Loading from './Loading'
import StyledModal from './StyledModal'

const ScreenStaff = ({ navigation }) => {
	const { storeId } = useAuth()
	const { shop } = useShop()
	const shopStaff = shop?.staff || []
	const modal = useModal({ title: 'Eliminar empleado' })

	const [staffId, setStaffId] = useState('')
	const [disabled, setDisabled] = useState(false)
	if (!shop) return <Loading id="ScreenStaff" />
	const handleDeleteStaff = async () => {
		setDisabled(true)
		const [err, res] = await catchError(
			ServiceStores.removeStaff({
				storeId: storeId,
				staffId
			})
		)
		console.log({ err, res })
		//*TODO:   Remove after migration staff is completely removed from store
		await ServiceStaff.removeStaffFromStore(storeId, staffId).then(console.log).catch(console.log)
		modal.toggleOpen()
		setDisabled(false)
	}
	return (
		<ScrollView
			style={{
				width: '100%'
			}}
		>
			<View style={gStyles.container}>
				<ListStaff
					staff={shopStaff}
					handleSubtract={(staffId: string) => {
						setStaffId(staffId)
						modal.toggleOpen()
					}}
					handleEdit={
						//@ts-expect-error
						(staffId: string) => {
							navigation.navigate('StackStaff', {
								screen: 'ScreenStaffEdit',
								params: { staffId }
							})
						}
					}

					// hideActions
				/>
				<StyledModal {...modal}>
					<Text>Desea sacar a este empleado tienda? </Text>
					<Button
						onPress={() => {
							handleDeleteStaff()
						}}
						disabled={disabled}
						label="Eliminar"
						icon="delete"
						color="error"
						buttonStyles={{
							width: 140,
							margin: 'auto',
							marginVertical: 10
						}}
					/>
				</StyledModal>
			</View>
		</ScrollView>
	)
}

export const ScreenStaffE = props => (
	<ErrorBoundary componentName="ScreenStaff">
		<ScreenStaff {...props} />
	</ErrorBoundary>
)

export default ScreenStaff
