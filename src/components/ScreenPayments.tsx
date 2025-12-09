import { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { ServicePayments } from '../firebase/ServicePayments'
import useModal from '../hooks/useModal'
import { gStyles } from '../styles'
import Button from './Button'
import InputRadios from './InputRadios'
import ListPayments from './ListPayments'
import StyledModal from './StyledModal'

export default function ScreenPayments({ route }) {
	const preList = route?.params?.payments || null
	const { storeId } = useStore()
	const [days, setDays] = useState(1)
	const [payments, setPayments] = useState([])

	useEffect(() => {
		handleGetPayments()
	}, [])

	const handleGetPayments = () => {
		if (preList?.length) {
			ServicePayments.list(preList).then(res => setPayments(res))
		} else {
			ServicePayments.getLast(storeId, { days: days }).then(res => setPayments(res))
		}
	}

	const modalDays = useModal({
		title: `Consultar ${days >= 365 ? 'un año atras' : `${days} días atras`}`
	})
	return (
		<ScrollView>
			<StyledModal {...modalDays}>
				<View>
					<InputRadios
						layout="row"
						value={days.toString()}
						options={[
							{
								label: 'Hoy',
								value: '1'
							},
							{ label: '5 dias', value: '5' },
							{ label: '15 días', value: '15' },
							{ label: '30 días', value: '30' },
							{ label: '1 año', value: '365' }
						]}
						label="Mostrar pagos registrados desde hace"
						setValue={value => {
							setDays(parseInt(value, 10))
						}}
					/>
					<Button
						label="Buscar"
						onPress={() => {
							modalDays.toggleOpen()
						}}
					></Button>
				</View>
			</StyledModal>
			<Text style={gStyles.h2}>Pagos de los últimos {days} días</Text>
			<ListPayments payments={payments} />
		</ScrollView>
	)
}
