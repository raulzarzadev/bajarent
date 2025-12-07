import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { useOrdersRedux } from '../hooks/useOrdersRedux'
import { onInvalidatePayment, onVerifyPayment } from '../libs/payments'
import type OrderType from '../types/OrderType'
import type PaymentType from '../types/PaymentType'
import ButtonConfirm from './ButtonConfirm'
import { ListE } from './List'
import RowPayment from './RowPayment'

export default function ListPayments({
	payments,
	onPressRow = () => {}
}: {
	payments: PaymentType[]
	onPressRow?: (paymentId: string) => void
}) {
	const { orders } = useOrdersRedux()
	const formattedPayments = formatPaymentWithOrder({
		payments,
		orders
	})
	const navigation = useNavigation()
	const sortFields = [
		{ key: 'orderFolio', label: 'Folio' },
		{ key: 'createdAt', label: 'Fecha' },
		{ key: 'amount', label: 'Cantidad' },
		{ key: 'method', label: 'Método' },
		{ key: 'reference', label: 'Referencia' },
		{ key: 'createdBy', label: 'Creado por' }
	]
	const { staff } = useStore()
	return (
		<ListE
			id="list-payments"
			// ComponentMultiActions={({ ids }) => {
			//   return (
			//     <ModalVerifyPayments
			//       ids={ids}
			//       fetchPayments={() => {
			//         //handleGetPayments()
			//       }}
			//     />
			//   )
			// }}
			data={formattedPayments.map(payment => {
				payment.amount = parseFloat(`${payment.amount || 0}`) || 0
				payment.createdBy = staff?.find(s => s.userId === payment.createdBy)?.name || 'sin nombre'
				return payment
			})}
			ComponentRow={({ item }) => (
				<RowPayment
					item={item}
					onVerified={() => {
						//  handleGetPayments()
					}}
				/>
			)}
			sortFields={sortFields}
			defaultSortBy="createdAt"
			defaultOrder="des"
			onPressRow={paymentId => {
				onPressRow?.(paymentId)
				//@ts-expect-error

				navigation.navigate('StackPayments', {
					screen: 'ScreenPaymentsDetails',
					params: {
						id: paymentId
					}
				})
			}}
			filters={[
				// {
				//   field: 'date',
				//   label: 'Fecha'
				// },
				{
					field: 'createdBy',
					label: 'Creado por'
				},
				{
					field: 'method',
					label: 'Método'
				}
				// {
				//   field: 'createdAt',
				//   label: 'Creado',
				//   isDate: true
				// }
			]}
		/>
	)
}

export const ModalVerifyPayments = ({
	ids,
	fetchPayments
}: {
	ids: string[]
	fetchPayments: () => void
}) => {
	const { storeId } = useStore()
	const handleVerifyPayments = async (ids: string[]) => {
		const validationsPromises = ids.map(id => {
			return onVerifyPayment(id, storeId).then(() => {})
		})

		return await Promise.all(validationsPromises)
			.then(res => {
				console.log({ res })
			})
			.catch(console.error)
			.finally(() => {
				fetchPayments()
			})
	}
	const handleInvalidatePayments = async (ids: string[]) => {
		const invalidation = ids.map(id => {
			return onInvalidatePayment(id, storeId).then(() => {})
		})

		return await Promise.all(invalidation)
			.then(res => {
				console.log({ res })
			})
			.catch(console.error)
			.finally(() => {
				fetchPayments()
			})
	}

	return (
		<View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
			<ButtonConfirm
				handleConfirm={async () => {
					await handleVerifyPayments(ids)
				}}
				confirmLabel="Verificar"
				confirmColor="success"
				confirmVariant="filled"
				text="¿Verificar pagos?"
				openLabel="Verificar pagos"
				openColor="success"
				openVariant="filled"
				openSize="xs"
			/>
			<ButtonConfirm
				handleConfirm={async () => {
					await handleInvalidatePayments(ids)
				}}
				confirmLabel="Invalidar"
				confirmColor="error"
				confirmVariant="ghost"
				text="Invalidar pagos?"
				openLabel="Invalidar pagos"
				openColor="error"
				openVariant="ghost"
				openSize="xs"
			/>
		</View>
	)
}

export const formatPaymentWithOrder = ({
	payments,
	orders
}: {
	payments: PaymentType[]
	orders: Partial<OrderType>[]
}): (PaymentType & {
	orderFolio: number
	orderName: string
	orderNote: string
})[] => {
	const paymentWithOrderData = payments?.map(p => {
		const consolidateOrder = orders?.find(o => o.id === p.orderId)

		return {
			...p,
			orderFolio: consolidateOrder?.folio ?? 0, // Usar ?? para proporcionar un valor predeterminado
			orderName: consolidateOrder?.fullName ?? '', // Usar ?? para proporcionar un valor predeterminado
			orderNote: consolidateOrder?.note ?? '' // Usar ?? para proporcionar un valor predeterminado
		}
	})
	return paymentWithOrderData
}
