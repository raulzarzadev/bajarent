import type { Timestamp } from 'firebase/firestore'
import React, { ReactNode, useEffect } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useAuth } from '../contexts/authContext'
import { useStore } from '../contexts/storeContext'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import useMyNav from '../hooks/useMyNav'
import { translateTime } from '../libs/expireDate'
import { getItem, setItem } from '../libs/storage'
import asDate from '../libs/utils-date'
import { gStyles } from '../styles'
import type { BalanceRowKeyType, BalanceRowType, BalanceType2 } from '../types/BalanceType'
import type ItemType from '../types/ItemType'
import type { OrderExtensionType } from '../types/OrderType'
import { BalanceAmountsE } from './BalanceAmounts'
import Divider from './Divider'
import ErrorBoundary from './ErrorBoundary'
import { ExpandibleListE } from './ExpandibleList'
import ListRow, { type ListRowField } from './ListRow'
import SpanOrder from './SpanOrder'

const BALANCE_ROW_SELECTED = 'balanceRowSelected'
export type BusinessStatusProps = { balance: Partial<BalanceType2> }
const BusinessStatus = ({ balance }: BusinessStatusProps) => {
	const { sections: storeSections } = useStore()

	const table: {
		field: keyof BalanceRowType | 'allItems'
		label: string
		width: ListRowField['width']
	}[] = [
		{ field: 'section', label: 'AREA', width: 100 },

		{
			field: 'deliveredToday',
			label: 'ENTREGADAS',
			width: 'rest'
		},

		{
			field: 'renewedToday',
			label: 'RENOVADAS',
			width: 'rest'
		},
		{
			field: 'paidToday',
			label: 'PAGADAS',
			width: 'rest'
		},
		{
			field: 'pickedUpToday',
			label: 'RECOGIDAS',
			width: 'rest'
		},
		{
			field: 'reported',
			label: 'REPORTE',
			width: 'rest'
		},
		{
			field: 'cancelledToday',
			label: 'CANCELADAS',
			width: 'rest'
		},
		{
			field: 'inRent',
			label: 'EN RENTA',
			width: 'rest'
		},
		{
			field: 'inStock',
			label: 'EN CARRO',
			width: 'rest'
		},
		{
			field: 'allItems',
			label: 'ITEMS',
			width: 'rest'
		}
	]

	const [selectedRow, setSelectedRow] = React.useState<string | null>(null)
	useEffect(() => {
		getItem(BALANCE_ROW_SELECTED).then(selectedRow => {
			setSelectedRow(selectedRow)
		})
	}, [])
	const handleSelectRow = (rowId: string) => {
		if (selectedRow === rowId) {
			setSelectedRow(null)
			setItem(BALANCE_ROW_SELECTED, null)
		} else {
			setSelectedRow(rowId)
			setItem(BALANCE_ROW_SELECTED, rowId)
		}
	}

	const [createdItems, setCreatedItems] = React.useState<Partial<string>[]>()
	const [retiredItems, setRetiredItems] = React.useState<Partial<string>[]>()
	useEffect(() => {
		setCreatedItems(balance?.createdItems || [])
		setRetiredItems(balance?.retiredItems || [])
	}, [balance])

	return (
		<View style={{ padding: 6, maxWidth: 999, margin: 'auto', width: '100%' }}>
			<View
				style={{
					marginVertical: 16,
					flexDirection: 'column',
					justifyContent: 'space-around',
					flexWrap: 'wrap'
				}}
			>
				<View>
					<Text style={gStyles.h2}>Items</Text>
					<View
						style={{
							flexDirection: 'row',
							flexWrap: 'wrap',
							justifyContent: 'space-around'
						}}
					>
						<CellItemsE items={createdItems} label="Creados" />
						<CellItemsE items={retiredItems} label="Retirados" />
					</View>
				</View>
				<View>
					<Text style={gStyles.h2}>Ordenes</Text>
					<View
						style={{
							flexDirection: 'row',
							flexWrap: 'wrap',
							justifyContent: 'space-around'
						}}
					>
						<ExpandibleOrderList label="Nuevas" ordersIds={balance?.createdOrders || []} />
						<ExpandibleOrderList label="Canceladas" ordersIds={balance?.cancelledOrders || []} />
						<Extensions extensions={balance?.orderExtensions} />
					</View>
				</View>
			</View>
			{/* HEADER */}
			<ListRow
				style={{ borderWidth: 0 }}
				fields={table.map(({ label, width }) => ({
					component: (
						<Text
							key={label}
							numberOfLines={1}
							style={[gStyles.tBold, gStyles.helper, gStyles.tCenter]}
						>
							{label}
						</Text>
					),
					width
				}))}
			/>
			<Divider mv={4} />

			{/* ROWS */}
			{balance?.sections
				?.sort((a, b) => {
					const aName = storeSections.find(s => s.id === a.section)?.name || a?.section
					const bName = storeSections.find(s => s.id === b.section)?.name || b?.section
					return aName.localeCompare(bName)
				})
				.sort((a, b) => {
					// always put  storage at second row
					if (a.section === 'workshop') return -1
					if (b.section === 'workshop') return 1
					return 0
				})
				.sort((a, b) => {
					// always put all at the first row
					if (a.section === 'all') return -1
					if (b.section === 'all') return 1
					return 0
				})
				.sort((a, b) => {
					// always put without section at the last row
					if (a.section === 'withoutSection') return -1
					if (b.section === 'withoutSection') return 1
					return 0
				})
				.map((balanceRow: BalanceRowType) => {
					const inRentItems = balanceRow?.inRent?.length || 0
					const inStockItems = balanceRow?.inStock?.length || 0

					if (allFieldsAreEmpty(balanceRow)) return null
					return (
						<View key={balanceRow?.section}>
							<Pressable
								onPress={() => {
									handleSelectRow(balanceRow?.section)
								}}
							>
								<ListRow
									style={{
										marginVertical: 2,
										backgroundColor:
											selectedRow === balanceRow.section ? 'lightblue' : 'transparent',
										borderWidth: 0
									}}
									key={balanceRow.section}
									fields={table.map(({ width, field }) => {
										const label = () => {
											if (field === 'section') {
												if (balanceRow[field] === 'all') {
													return 'Todas'
												}
												if (balanceRow[field] === 'withoutSection') {
													return 'Sin area'
												}

												return storeSections.find(s => s.id === balanceRow[field])?.name || 'S/N'
											}

											if (field === 'reported') {
												const reports = balanceRow['reported']?.length || 0
												const solved = balanceRow['solvedToday']?.length || 0
												return `${solved}/${reports}`
											}
											if (field === 'allItems') {
												return inRentItems + inStockItems
											}

											if (Array.isArray(balanceRow[field])) {
												return balanceRow[field].length
											}
										}
										return {
											component: (
												<Text key={field} numberOfLines={1} style={[gStyles.tCenter]}>
													{label()}
												</Text>
											),
											width
										}
									})}
								/>
							</Pressable>
							{selectedRow === balanceRow.section && (
								<View>
									<Text style={gStyles.h2}>
										{sectionLabel({
											sectionId: balanceRow.section,
											storeSections
										})}
									</Text>
									<View
										style={{
											flexDirection: 'row',
											flexWrap: 'wrap',
											justifyContent: 'space-evenly'
										}}
									>
										<CellOrders
											label={'Rentas'}
											field="deliveredToday"
											sectionSelected={balanceRow.section}
											sections={balance.sections}
											day={balance.createdAt}
											defaultExpanded
										/>
										<CellOrders
											label={'Renovadas'}
											field="renewedToday"
											sectionSelected={balanceRow.section}
											sections={balance.sections}
											day={balance.createdAt}
											defaultExpanded
										/>
										<CellOrders
											label={'Pagadas'}
											field="paidToday"
											sectionSelected={balanceRow.section}
											sections={balance.sections}
											day={balance.createdAt}
											defaultExpanded
										/>
										<CellOrders
											label={'Recogidas'}
											field="pickedUpToday"
											sectionSelected={balanceRow.section}
											sections={balance.sections}
											defaultExpanded
										/>
										<CellOrders
											label={'Reportes pendientes'}
											field="reported"
											sectionSelected={balanceRow.section}
											sections={balance.sections}
										/>
										<CellOrders
											label={'Reportes resueltos'}
											field="solvedToday"
											sectionSelected={balanceRow.section}
											sections={balance.sections}
										/>
										<CellOrders
											label={'Canceladas'}
											field="cancelledToday"
											sectionSelected={balanceRow.section}
											sections={balance.sections}
										/>
										<CellOrders
											label={'Todas'}
											field="inRent"
											sectionSelected={balanceRow.section}
											sections={balance.sections}
											hiddenList
										/>
										<CellItemsE
											items={balance.sections.find(s => s?.section === selectedRow)?.inStock}
											label="En carro"
										></CellItemsE>
									</View>
									{/* <View>
                    <Text style={[gStyles.h2, { marginTop: 8 }]}>Pagos</Text>
                  </View> */}
									<BalanceAmountsE payments={balanceRow.payments} />
								</View>
							)}
							<Divider mv={4} />
						</View>
					)
				})}
		</View>
	)
}

const sectionLabel = ({ sectionId, storeSections }) => {
	if (sectionId === 'all') return 'Todas'
	if (sectionId === 'withoutSection') return 'Sin area'
	return storeSections.find(s => s.id === sectionId)?.name || 'S/N'
}

const allFieldsAreEmpty = (balanceRow: BalanceRowType) => {
	return Object.keys(balanceRow).every(key => {
		if (key === 'section') return true
		if (Array.isArray(balanceRow[key])) {
			return !balanceRow[key].length
		}
		return !balanceRow[key]
	})
}

export const CellItemsE = (props: { items: string[]; label: string }) => {
	return (
		<ErrorBoundary componentName="CellItems">
			<CellItems {...props} />
		</ErrorBoundary>
	)
}

export const CellItems = ({ items = [], label }: { items: string[]; label: string }) => {
	const { storeId } = useAuth()
	const { toItems } = useMyNav()
	const [itemsData, setItemsData] = React.useState<Partial<ItemType>[]>()

	useEffect(() => {
		ServiceStoreItems.getList({ storeId, ids: items }, { fromCache: true }).then(res =>
			setItemsData(res)
		)
	}, [items])

	return (
		<ExpandibleListE
			label={label}
			onPressTitle={() => toItems({ ids: items })}
			onPressRow={id => toItems({ id })}
			items={itemsData?.map(item => ({
				id: item.id,
				content: (
					<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
						<Text>{item.categoryName} </Text>
						<Text>{item.number} </Text>
					</View>
				)
			}))}
		/>
	)
}

export const BusinessStatusE = (props: BusinessStatusProps) => (
	<ErrorBoundary componentName="BusinessStatus">
		<BusinessStatus {...props} />
	</ErrorBoundary>
)

export const CellOrdersE = (props: CellOrdersProps) => (
	<ErrorBoundary componentName="CellOrders">
		<CellOrders {...props} />
	</ErrorBoundary>
)
export type CellOrdersProps = {
	label: string
	sections: BalanceType2['sections']
	field: BalanceRowKeyType
	sectionSelected: string
	hiddenList?: boolean
	day?: Date | Timestamp
	defaultExpanded?: boolean
}
const CellOrders = ({
	label,
	sections,
	field,
	sectionSelected,
	day,
	defaultExpanded
}: CellOrdersProps) => {
	const section = sections?.find(s => s.section === sectionSelected)
	const orders = section?.[field] as string[]
	const { toOrders } = useMyNav()
	if (!orders.length) return null

	return (
		<ExpandibleListE
			defaultExpanded={defaultExpanded}
			label={label}
			onPressRow={id => {
				toOrders({ id })
			}}
			onPressTitle={() => {
				toOrders({ ids: orders })
			}}
			items={orders.map(o => ({
				id: o,
				content: (
					<SpanOrder
						orderId={o}
						showName
						showTime
						showLastExtension
						showDatePaymentsAmount={day}
						showItems
					/>
				)
			}))}
		/>
	)
}

const Extensions = ({ extensions }: { extensions: OrderExtensionType[] }) => {
	const { toOrders } = useMyNav()
	return (
		<View>
			<ExpandibleListE
				label="Extensiones"
				onPressTitle={() => {
					toOrders({
						ids: extensions.map(e => e.orderId),
						idsTitle: 'Extensiones'
					})
				}}
				onPressRow={id => {
					const orderId = extensions.find(e => e.id === id)?.orderId
					toOrders({ id: orderId })
				}}
				items={extensions
					?.sort((a, b) => asDate(a.createdAt).getTime() - asDate(b.createdAt).getTime())
					.map(extension => ({
						id: extension.id,
						content: (
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignContent: 'center'
								}}
							>
								<Text
									style={{
										textAlignVertical: 'center',
										fontWeight: 'bold',
										marginRight: 4
									}}
								>
									{translateTime(extension.time, { shortLabel: true })}
								</Text>
								<SpanOrder orderId={extension.orderId} showName showItems />
							</View>
						)
					}))}
			/>
		</View>
	)
}

export default BusinessStatus

const ExpandibleOrderList = ({ ordersIds, label }: { ordersIds: string[]; label: string }) => {
	const { toOrders } = useMyNav()
	return (
		<ExpandibleListE
			onPressRow={id => {
				toOrders({ id })
			}}
			onPressTitle={() => {
				toOrders({ ids: ordersIds })
			}}
			items={ordersIds.map(orderId => {
				return {
					id: orderId,
					content: <SpanOrder orderId={orderId} showName showItems />
				}
			})}
			label={label}
		/>
	)
}
