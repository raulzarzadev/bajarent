import { deleteField } from 'firebase/firestore'
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import dictionary, { asCapitalize } from '../dictionary'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { translateTime } from '../libs/expireDate'
import asDate, { dateFormat } from '../libs/utils-date'
import { gStyles } from '../styles'
import type OrderType from '../types/OrderType'
import Button from './Button'
import ButtonConfirm from './ButtonConfirm'
import DateCell from './DateCell'
import Icon from './Icon'
import ListRow from './ListRow'
import { OrderDates } from './OrderDetails'
import SpanUser from './SpanUser'
import TextInfo from './TextInfo'

const OrderExtensions = ({ order }: { order: Partial<OrderType> }) => {
	const { permissions } = useEmployee()
	const [count, setCount] = useState(2)
	const MAX_EXTENSIONS_COUNT = 10
	const canDeleteExtension = permissions?.canDeleteExtension
	const extensionsObj = order?.extensions || {}
	const extensions = Object.values(extensionsObj).sort((a, b) => {
		return asDate(a?.createdAt).getTime() < asDate(b?.createdAt).getTime() ? 1 : -1
	})
	const expireAt = order?.expireAt
	// FIXME: some times extensions are not created properly
	const handleCancelExtension = async ({ extensionId, orderId }) => {
		const prevExtension = extensions?.[1]
		//* if there is no prev extension, then the order is delivered
		const newExpireDate: Date = prevExtension?.expireAt || order.deliveredAt
		await ServiceOrders.update(orderId, {
			expireAt: newExpireDate,
			[`extensions.${extensionId}`]: deleteField()
		})
			.then(console.log)
			.catch(console.error)
	}
	const isTheLast = id => {
		return extensions[0].id === id
	}

	return (
		<View style={{ padding: 4 }}>
			<OrderDates
				status={order.status}
				expireAt={expireAt}
				pickedUp={order.pickedUpAt}
				scheduledAt={order.scheduledAt}
				startedAt={order.deliveredAt}
			/>
			<Text style={gStyles.h3}>Extenciones </Text>
			<ListRow
				fields={[
					{
						width: 80,
						component: <Text style={gStyles.tBold}>Comienza</Text>
					},
					{
						width: 80,
						component: <Text style={gStyles.tBold}>Termina</Text>
					},
					{
						width: 'rest',
						component: <Text style={[gStyles.tBold, gStyles.tCenter]}>Tipo</Text>
					},
					{
						width: 100,
						component: <Text style={gStyles.tBold}>Creación</Text>
					}
				]}
			/>
			{extensions
				.slice(0, count)
				.map(({ startAt, expireAt, createdBy, createdAt, id = 'id', reason, time, content }) => (
					<View
						key={id}
						style={{
							flexDirection: 'row',
							marginVertical: 4,
							justifyContent: 'space-around'
						}}
					>
						<ListRow
							fields={[
								{
									width: 160,
									component: (
										<View style={{ flexDirection: 'row', alignItems: 'center' }}>
											<DateCell date={startAt} showTimeAgo={false} showTime />
											<View>
												<Icon icon="rowRight" size={22} />
											</View>
											<DateCell date={expireAt} showTimeAgo={false} showTime />
										</View>
									)
								},

								{
									width: 'rest',
									component: (
										<View>
											<Text style={gStyles.tCenter}>{asCapitalize(dictionary(reason))}</Text>
											{!!content && (
												<Text
													style={[gStyles.helper, { textAlign: 'center', paddingHorizontal: 4 }]}
												>{`${content}`}</Text>
											)}
											<Text style={gStyles.tCenter} numberOfLines={1}>
												{translateTime(time)}
											</Text>
										</View>
									)
								},
								{
									width: 100,
									component: (
										<View>
											<SpanUser userId={createdBy} />
											<Text style={gStyles.helper}>
												{dateFormat(asDate(createdAt), 'ddMMM HH:mm')}
											</Text>
										</View>
									)
								},

								{
									width: 30,
									component: (
										<View>
											{isTheLast(id) && canDeleteExtension && (
												<ButtonConfirm
													icon="close"
													justIcon
													openColor="error"
													openSize="small"
													confirmColor="error"
													confirmLabel="Eliminar extención"
													handleConfirm={async () => {
														await handleCancelExtension({
															extensionId: id,
															orderId: order.id
														})
													}}
												>
													<TextInfo
														type="info"
														text="Las extensiones solo pueden ser eliminadas una por
                            una, para evtiar conflictos de fechas"
													/>
												</ButtonConfirm>
											)}
										</View>
									)
								}
							]}
						/>
					</View>
				))}
			<Button
				disabled={count > MAX_EXTENSIONS_COUNT || count >= extensions.length}
				size="xs"
				label="mostrar más"
				variant="ghost"
				fullWidth={false}
				buttonStyles={{ margin: 'auto' }}
				onPress={() => setCount(count + 5)}
			></Button>
		</View>
	)
}

export default OrderExtensions

const styles = StyleSheet.create({})
