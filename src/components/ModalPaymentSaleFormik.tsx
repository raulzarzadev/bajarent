import { StyleSheet } from 'react-native'
import React from 'react'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import Button from './Button'
import PaymentType, { PaymentBase } from '../types/PaymentType'
import ErrorBoundary from './ErrorBoundary'
import { ServicePayments } from '../firebase/ServicePayments'
import FormPayment from './FormPayment'
import { useStore } from '../contexts/storeContext'
import { useFormik, useFormikContext } from 'formik'
import FormikInputDate from './FormikInputDate'
import { orderAmount } from '../libs/order-amount'
import FormikErrorsList from './FormikErrorsList'
import { useAuth } from '../contexts/authContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderType, { order_status } from '../types/OrderType'

export type ModalPaymentSaleProps = {
	defaultAmount?: number
	onSubmit: () => Promise<{ orderId: string }>
}
export const ModalPaymentSale = ({ onSubmit }: ModalPaymentSaleProps) => {
	const { values: orderFormValues, errors } = useFormikContext<Partial<OrderType>>()

	const { storeId } = useStore()
	const { user } = useAuth()
	const defaultPaymentValues: PaymentBase = {
		amount: orderAmount(orderFormValues),
		reference: '',
		date: new Date(),
		method: 'transfer',
		storeId,
		orderId: ''
	}

	const modalPayAndDelivery = useModal({ title: 'Pagar y entregar' })
	const modalPayAndSchedule = useModal({ title: 'Pagar y programar entrega' })

	const handleSavePayment = async ({ values }) => {
		const amount = parseFloat(values.amount || 0)
		await ServicePayments.orderPayment({
			...values,
			amount
		})
			.then(console.log)
			.catch(console.error)
	}

	const handleSubmit = ({
		values,
		variant
	}: {
		values: Partial<PaymentType>
		variant: 'paidAndScheduled' | 'paidAndDelivery'
	}) => {
		//* first save order to get orderId
		//* once saved get orderId and save payment
		return onSubmit()
			.then(async res => {
				console.log({ variant, res })
				if (!res.orderId) return console.error('no orderId')
				values.createdBy = user.id //* <-- is needed to update paid order
				values.orderId = res?.orderId || null //* <-- is needed to update paid order
				values.storeId = storeId
				await handleSavePayment({ values })

				if (variant === 'paidAndScheduled') {
					await ServiceOrders.update(res.orderId, {
						status: order_status.AUTHORIZED,
						scheduledAt: orderFormValues?.scheduledAt || new Date()
					})
				}
				if (variant === 'paidAndDelivery') {
					await ServiceOrders.update(res.orderId, {
						status: order_status.DELIVERED
					})
				}

				return
			})
			.catch(console.error)
	}

	return (
		<>
			<Button
				onPress={modalPayAndDelivery.toggleOpen}
				icon="money"
				size="small"
				color="success"
				variant="ghost"
				label="Pagar y entregar"
			></Button>
			<Button
				onPress={modalPayAndSchedule.toggleOpen}
				icon="truck"
				size="small"
				variant="ghost"
				label="Pagar y programar entrega"
			></Button>
			<StyledModal {...modalPayAndDelivery}>
				<FormPayment
					disabledSubmit={Object.keys(errors).length > 0}
					values={defaultPaymentValues}
					onSubmit={async values => {
						return await handleSubmit({ values, variant: 'paidAndDelivery' })
					}}
				/>
				<FormikErrorsList />
			</StyledModal>
			<StyledModal {...modalPayAndSchedule}>
				<FormikInputDate name="scheduledAt" label="Fecha de entrega" />
				<FormPayment
					disabledSubmit={Object.keys(errors).length > 0}
					onSubmit={async values => {
						// modal.toggleOpen()
						try {
							return await handleSubmit({ values, variant: 'paidAndScheduled' })
						} catch (error) {
							console.error({ error })
						}
					}}
				/>
				<FormikErrorsList />
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
