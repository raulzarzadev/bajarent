import { useNavigation } from '@react-navigation/native'
import { isToday } from 'date-fns'
import { Formik } from 'formik'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { useAuth } from '../contexts/authContext'
import { useStore } from '../contexts/storeContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { ServicePayments } from '../firebase/ServicePayments'
import useModal from '../hooks/useModal'
import { expireDate2, translateTime } from '../libs/expireDate'
import { onComment, onExtend_V2, onPay } from '../libs/order-actions'
import asDate, { dateFormat } from '../libs/utils-date'
import { onSendOrderWhatsapp } from '../libs/whatsapp/sendOrderMessage'
import { useCustomers } from '../state/features/costumers/costumersSlice'
import { useCurrentWork } from '../state/features/currentWork/currentWorkSlice'
import { gStyles } from '../styles'
import theme from '../theme'
import type OrderType from '../types/OrderType'
import type PaymentType from '../types/PaymentType'
import type { TimePriceType } from '../types/PriceType'
import Button from './Button'
import CurrencyAmount from './CurrencyAmount'
import ErrorBoundary from './ErrorBoundary'
import { FormikSelectCategoriesE } from './FormikSelectCategories'
import FormPayment from './FormPayment'
import InputCheckbox from './Inputs/InputCheckbox'
import StyledModal from './StyledModal'
import TextInfo from './TextInfo'

const FormOrderRenew = ({ order }: FormOrderRenewProps) => {
	const { goBack } = useNavigation()
	const { store } = useStore()
	const { user } = useAuth()
	const { addWork } = useCurrentWork()
	const { data: customers } = useCustomers()
	const items = order?.items || []
	const [payment, setPayment] = useState<Partial<PaymentType>>({
		method: 'transfer',
		amount: 0
	})

	const [newItems, setNewItems] = useState<OrderType['items']>(items)
	const [submitting, setSubmitting] = useState(false)
	const onSubmit = async (values: { items: OrderType['items'] }) => {
		if (addPay) {
			setNewItems(values.items)
			const amount = values.items.reduce((acc, item) => {
				return acc + (item?.priceSelected?.amount || 0)
			}, 0)
			setPayment({ ...payment, amount })
			modalPayment.toggleOpen()
		} else {
			setSubmitting(true)
			await handleExtend({
				items: values.items,
				time: values.items?.[0]?.priceSelected?.time,
				startAt: order.expireAt,
				orderId: order.id
			})
				.then(res => {
					console.log({ res })

					goBack()
				})
				.catch(err => {
					console.log({ err })
				})
				.finally(() => {
					setSubmitting(false)
				})
		}
	}
	const handleExtend = async ({
		items,
		time,
		startAt,
		orderId,
		payment
	}: {
		items: OrderType['items']
		time: TimePriceType
		startAt: Date
		orderId: string
		payment?: PaymentType
	}) => {
		//* add extension to current work
		await addWork({
			work: {
				type: 'order',
				action: 'rent_renewed',
				details: {
					orderId,
					sectionId: order?.assignToSection || null
				}
			}
		})
		await onExtend_V2({
			orderId,
			reason: 'renew',
			time, //TODO: this should be the shrotest time?
			startAt,
			items
		})
		await onComment({
			orderId,
			content: `Renovación de ${order.folio} x ${translateTime(time)}`,
			type: 'comment',
			storeId: order.storeId
		})

		//***** SEND RENEW MESSAGE */
		const updatedOrder = await ServiceOrders.get(orderId)

		onSendOrderWhatsapp({
			store,
			order: updatedOrder,
			type: 'sendRenewed',
			userId: user.id,
			lastPayment: payment,
			customer: customers?.find(c => c.id === order?.customerId)
		})
	}
	const [addPay, setAddPay] = useState(true)
	const modalPayment = useModal({ title: 'Pago de renovación' })

	const handleSubmitPayment = async ({ payment }) => {
		// 1. pay
		// 2. handleExtend

		await onPay({
			storeId: order.storeId,
			orderId: order.id,
			payment
		})
			.then(async res => {
				//* add payment to current work
				await addWork({
					work: {
						type: 'payment',
						action: 'payment_created',
						details: {
							orderId: order.id,
							paymentId: res.res.id,
							sectionId: order?.assignToSection || null
						}
					}
				})
				const payment = await ServicePayments.get(res.res.id)

				await handleExtend({
					items: newItems,
					time: newItems[0].priceSelected.time,
					startAt: order.expireAt,
					orderId: order.id,
					payment
				})
					.then(console.log)
					.catch(console.error)
			})
			.catch(console.error)
			.finally(() => {
				goBack()
				modalPayment.toggleOpen()
				setSubmitting(false)
			})
	}

	return (
		<View>
			<Formik
				initialValues={{ items }}
				onSubmit={values => {
					onSubmit(values)
				}}
			>
				{({ handleSubmit, values }) => {
					const currentPriceSelected = values?.items?.[0]?.priceSelected
					return (
						<View>
							<FormikSelectCategoriesE name="items" selectPrice label="Articulos" />

							<View
								style={{
									borderWidth: 2,
									borderRadius: 8,
									borderColor: theme.error,
									marginVertical: 8,
									padding: 2
								}}
							>
								<View
									style={{
										borderWidth: 1,
										borderRadius: 8,
										borderColor: theme.error,
										padding: 6,
										borderStyle: 'dashed'
									}}
								>
									<View style={{ justifyContent: 'center' }}>
										<Text style={[{ textAlign: 'center' }]}>
											{order.folio} {order?.fullName}
										</Text>
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'center'
											}}
										>
											<Text style={[gStyles.h1, { textDecorationLine: 'underline' }]}>
												{translateTime(currentPriceSelected?.time)}{' '}
											</Text>
										</View>
										<CurrencyAmount
											style={{ textAlign: 'center' }}
											amount={currentPriceSelected?.amount}
										/>

										<Text style={[{ marginBottom: 8, textAlign: 'center' }]}>
											{dateFormat(
												expireDate2({
													startedAt: order?.expireAt,
													price: currentPriceSelected
												}),
												'dd/MMM'
											)}
										</Text>
										<View
											style={{
												marginVertical: 16,
												margin: 'auto'
											}}
										>
											<InputCheckbox
												label="Agregar pago"
												value={addPay}
												setValue={() => {
													setAddPay(!addPay)
												}}
											/>
										</View>
									</View>
									{hasBeenRenewedToday(order) && (
										<TextInfo
											text="Esta orden ya fue renovada el día de hoy. ¿Desas renonvarla de nuevo?"
											defaultVisible
											type="warning"
										/>
									)}
									<Button
										disabled={submitting}
										onPress={() => {
											handleSubmit()
										}}
										label={`Renovar ${translateTime(currentPriceSelected?.time)}`}
									/>
								</View>
							</View>
						</View>
					)
				}}
			</Formik>
			<StyledModal {...modalPayment}>
				<FormPayment
					onSubmit={async value => {
						return await handleSubmitPayment({ payment: value })
					}}
					values={payment}
				/>
			</StyledModal>
		</View>
	)
}
export type FormOrderRenewProps = { order: OrderType }
export const FormOrderRenewE = (props: FormOrderRenewProps) => (
	<ErrorBoundary componentName="FormOrderRenew">
		<FormOrderRenew {...props} />
	</ErrorBoundary>
)

export default FormOrderRenew

const hasBeenRenewedToday = (order: OrderType) => {
	const renewedAt = asDate(order.renewedAt)
	return isToday(renewedAt)
}
