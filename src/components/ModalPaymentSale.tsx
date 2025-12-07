import { StyleSheet, View } from 'react-native'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import Button from './Button'
import PaymentType, { PaymentBase } from '../types/PaymentType'
import ErrorBoundary from './ErrorBoundary'
import { ServicePayments } from '../firebase/ServicePayments'
import FormPayment from './FormPayment'
import { useStore } from '../contexts/storeContext'
import { orderAmount } from '../libs/order-amount'
import { useAuth } from '../contexts/authContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { order_status } from '../types/OrderType'
import { useOrderDetails } from '../contexts/orderContext'
import { useState } from 'react'
import { InputDateE } from './InputDate'
import { ViewInputForm } from './FormOrder2'

export type ModalPaymentSaleProps = {
	orderId: string
}
export const ModalPaymentSale = ({ orderId }: ModalPaymentSaleProps) => {
	const { order } = useOrderDetails()
	const [scheduledAt, setScheduledAt] = useState<Date | null>(null)

	const { storeId } = useStore()
	const { user } = useAuth()
	const defaultPaymentValues: PaymentBase = {
		amount: orderAmount(order),
		reference: '',
		date: new Date(),
		method: 'transfer',
		storeId,
		orderId: ''
	}

	const modalPayAndDelivery = useModal({ title: 'Cobrar' })

	const handleSavePayment = async ({ values }) => {
		const amount = parseFloat(values.amount || 0)
		await ServicePayments.orderPayment({
			...values,
			amount
		})
			.then(console.log)
			.catch(console.error)
	}

	const handleSubmit = async ({ values }: { values: Partial<PaymentType> }) => {
		//* first save order to get orderId
		//* once saved get orderId and save payment

		if (!orderId) return console.error('no orderId')
		values.createdBy = user.id //* <-- is needed to update paid order
		values.orderId = orderId || null //* <-- is needed to update paid order
		values.storeId = storeId
		await handleSavePayment({ values })

		await ServiceOrders.update(orderId, {
			status: order_status.DELIVERED,
			scheduledAt
		})

		return
	}

	return (
		<>
			<Button
				onPress={modalPayAndDelivery.toggleOpen}
				icon="money"
				size="small"
				color="success"
				label="Cobrar"
			></Button>

			<StyledModal {...modalPayAndDelivery}>
				<ViewInputForm>
					{!!scheduledAt ? (
						<View>
							<Button
								onPress={() => setScheduledAt(null)}
								icon="close"
								label="Quitar fecha"
								size="xs"
								variant="ghost"
							></Button>
							<InputDateE setValue={setScheduledAt} value={scheduledAt} />
						</View>
					) : (
						<Button
							onPress={() => setScheduledAt(new Date())}
							icon="calendar"
							variant="ghost"
							label="Programar fecha"
						></Button>
					)}
				</ViewInputForm>
				<ViewInputForm>
					<FormPayment
						//  disabledSubmit={Object.keys(errors).length > 0}
						values={defaultPaymentValues}
						onSubmit={async values => {
							return await handleSubmit({ values })
						}}
					/>
				</ViewInputForm>
			</StyledModal>
		</>
	)
}

export default (props: ModalPaymentSaleProps) => {
	return (
		<ErrorBoundary componentName="ModalPaymentSale">
			<ModalPaymentSale {...props} />
		</ErrorBoundary>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between'
	},
	item: {
		width: '48%', // for 2 items in a row
		marginVertical: '1%' // spacing between items
	},
	repairItemForm: {
		marginVertical: 4
	}
})
