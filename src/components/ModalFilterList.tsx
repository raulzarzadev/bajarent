import { formatDate } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import dictionary, { type Labels } from '../dictionary'
import useFilter, { type CollectionSearch } from '../hooks/useFilter'
import useModal from '../hooks/useModal'
import { gStyles } from '../styles'
import theme, { colors, ORDER_TYPE_COLOR, STATUS_COLOR } from '../theme'
import type OrderType from '../types/OrderType'
import { order_status, order_type, typeOrderIcon } from '../types/OrderType'
import Button from './Button'
import Chip from './Chip'
import ErrorBoundary from './ErrorBoundary'
import type { IconName } from './Icon'
import InputSearch from './Inputs/InputSearch'
import StyledModal from './StyledModal'

export type FilterListType<T> = {
	field: keyof T
	label: string
	boolean?: boolean
	isDate?: boolean
	icon?: IconName
	color?: string
	titleColor?: string
	booleanValue?: boolean
}

export type ModalFilterOrdersProps<T> = {
	data: T[]
	setData: (orders: T[]) => void
	filters?: FilterListType<T>[]
	preFilteredIds?: string[]
	collectionSearch?: CollectionSearch
	setCollectionData?: (data: T[]) => void
}

function ModalFilterList<T>({
	data,
	filters,
	setData,
	setCollectionData,
	preFilteredIds,
	collectionSearch
}: ModalFilterOrdersProps<T>) {
	const { sections: storeSections, staff } = useStore()
	const filterModal = useModal({ title: 'Filtrar por' })
	const [customFilterSelected, setCustomFilterSelected] = useState(false)

	const {
		filterBy,
		handleClearFilters,
		filteredData,
		customData,
		filtersBy,
		search,
		searchValue,
		loading
	} = useFilter<T>({
		data,
		collectionSearch,
		debounceSearch: 1000
	})

	useEffect(() => {
		setData?.(filteredData)
	}, [filteredData])

	useEffect(() => {
		setCollectionData?.(customData)
	}, [customData])

	useEffect(() => {
		if (preFilteredIds?.length) {
			filterBy('customIds', preFilteredIds)
			setCustomFilterSelected(true)
		}
	}, [preFilteredIds])

	const isFilterSelected = (field, value) => {
		const isBoolean = value === 'true' || value === 'false'
		if (isBoolean) {
			return filtersBy.some(a => a.field === field && a.value === (value === 'true'))
		}
		if (field === 'status' && value === 'REPORTED') {
			return filtersBy.some(a => a.field === 'hasNotSolvedReports' && a.value)
		}
		return filtersBy.some(a => a.field === field && a.value === value)
	}

	const createFieldFilters = (field: string, isBoolean?: boolean): Record<string, T[]> => {
		const groupedByField = filteredData.reduce((acc, curr) => {
			let currField = curr?.[field]
			if (isBoolean) {
				currField = currField ? 'true' : 'false'
			}

			//* Avoid invalid fields
			if (!currField || currField === 'undefined') return acc

			if (currField instanceof Timestamp) {
				currField = formatDate(currField.toDate(), 'dd/MM/yy')
			}

			if (acc[currField]) {
				acc[currField].push(currField)
			} else {
				acc[currField] = [currField]
			}
			return acc
		}, {})

		return groupedByField
	}

	const chipColor = (field: string, value: string) => {
		//* FILTERS FOR COMMENTS
		if (field === 'type') {
			if (value === 'comment') return theme.warning
			if (value === 'report') return theme.error
		}
		if (field === 'solved') {
			return value === 'true' ? theme.success : theme.error
		}

		//* this is useful for orders table to find status color
		if (field === 'status') {
			return STATUS_COLOR[value as keyof typeof STATUS_COLOR] || theme.base
		}
		//* this is useful for orders table to find type color
		if (field === 'type') {
			return ORDER_TYPE_COLOR[value as keyof typeof ORDER_TYPE_COLOR] || theme.base
		}

		if (field === 'colorLabel') {
			return value
		}

		return theme.info
	}

	const chipIconType = (type: OrderType['type']): { icon: IconName; color: string } => {
		//<------ * just change the title color in  filters by OrderType
		if ([order_type.RENT, order_type.SALE, order_type.REPAIR].includes(type)) {
			return { icon: typeOrderIcon(type), color: theme.white }
		}
	}

	const chipLabel = (field: string, value: string) => {
		//* this is useful for orders table to find section name

		if (
			field === 'type' &&
			[order_type.RENT, order_type.SALE, order_type.REPAIR].includes(value as order_type)
		) {
			if (value === order_type.RENT) return 'RENTA'
			if (value === order_type.SALE) return 'VENTA'
			if (value === order_type.REPAIR) return 'REPARACIÓN'
		}

		if (field === 'status') {
			if (value === order_status.DELIVERED) return 'ENTREGADO'
			if (value === order_status.REPAIRING) return 'REPARANDO'
			if (value === order_status.REPAIRED) return 'REPARADO'
			if (value === order_status.PICKED_UP) return 'RECOGIDO'
			if (value === order_status.RENEWED) return 'RENOVADO'
			if (value === order_status.CANCELLED) return 'CANCELADO'
			if (value === order_status.AUTHORIZED) return 'PEDIDO'
			if (value === order_status.PENDING) return 'PENDIENTE'
			if (value === order_status.REPORTED) return 'REPORTADO'
		}

		if (field === 'assignToSection') {
			const res = storeSections.find(a => a.id === value)?.name || ''
			return dictionary(res as Labels).toUpperCase()
		}
		if (field === 'colorLabel') {
			const res = Object.entries(colors).map(([key, value]) => ({
				color: value,
				label: key
			}))
			const color = res.find(a => a.color === value)?.label || ''
			return dictionary(color as Labels).toUpperCase()
		}
		//* this is useful for payments table to find staff name
		if (field === 'userId') {
			const staffFound = staff?.find(a => a.userId === value)
			return staffFound?.name || ''
		}

		return dictionary(value as Labels).toUpperCase()
	}
	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					flexDirection: 'row'
				}}
			>
				<InputSearch
					style={{ flex: 1 }}
					placeholder="Buscar..."
					value={searchValue}
					onChange={e => {
						search(e)
					}}
					loading={loading}
					// leftIcon={
					//   loading
					//     ? 'loading'
					//     : (searchValue.length || filtersBy.length) === 0
					//     ? 'search'
					//     : 'close'
					// }
					// onPressLeftIcon={(action) => {
					//   if (action === 'close') {
					//     handleClearFilters()
					//   }
					// }}
				/>
				{/* <InputTextStyled
          style={{ width: '100%' }}
          containerStyle={{ flex: 1 }}
          placeholder="Buscar..."
          value={searchValue}
          onChangeText={(e) => {
            search(e)
          }}
          leftIcon={
            loading
              ? 'loading'
              : (searchValue.length || filtersBy.length) === 0
              ? 'search'
              : 'close'
          }
          onPressLeftIcon={(action) => {
            if (action === 'close') {
              handleClearFilters()
            }
          }}
        /> */}

				{filters?.length > 0 && (
					<View style={{ marginLeft: 8, flexDirection: 'row', flexWrap: 'wrap' }}>
						<Button
							variant={!filtersBy?.length ? 'ghost' : 'filled'}
							color={!filtersBy?.length ? 'black' : 'primary'}
							icon="filter"
							onPress={() => {
								filterModal.toggleOpen()
							}}
							justIcon
						/>
						{/* {!!filtersBy?.length && (
              <Button
                icon="close"
                justIcon
                variant="ghost"
                onPress={() => {
                  handleClearFilters()
                }}
              />
            )} */}
					</View>
				)}
			</View>

			{/*//************* CHIP BOOLEAN FILTERS OUT SIDE OF MODAL ***********/}

			<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
				{filters
					?.filter(f => f.boolean)
					?.map(({ field, label, icon, color, titleColor, booleanValue = true }) => {
						const count = filteredData?.filter(a => a?.[field] === booleanValue)?.length
						if (!count) return null
						return (
							<Chip
								key={label}
								icon={icon}
								size="xs"
								color={color}
								iconColor={titleColor}
								titleColor={titleColor}
								disabled={count === 0}
								title={`${count > 0 ? count : ''}`}
								aria-label={label}
								onPress={() => {
									filterBy(field as string, booleanValue)
								}}
								style={{
									margin: 4,
									borderWidth: 3,
									borderColor: isFilterSelected(field, 'true') ? theme.black : 'transparent'
									// backgroundColor:
								}}
							/>
						)
					})}
			</View>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Text style={{ textAlign: 'center', marginRight: 4 }}>
					{filteredData?.length} coincidencias
				</Text>
			</View>
			<StyledModal {...filterModal}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<Text style={{ textAlign: 'center' }}>{filteredData.length} coincidencias</Text>
					{filtersBy?.length > 0 && (
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<Button
								icon="broom"
								variant="ghost"
								color="secondary"
								onPress={() => {
									handleClearFilters()
									setCustomFilterSelected(false)
								}}
								justIcon
							/>
							<Text style={{ fontSize: 10 }}>Todas</Text>
						</View>
					)}
				</View>

				{!!preFilteredIds?.length && (
					<View style={{ justifyContent: 'center' }}>
						<Chip
							color={theme.info}
							title={'Filtro pre-definido'}
							onPress={() => {
								filterBy('customIds', preFilteredIds)
								setCustomFilterSelected(!customFilterSelected)
							}}
							style={{
								margin: 4,
								borderWidth: 4,
								marginBottom: 8,
								borderColor: customFilterSelected ? theme.black : 'transparent',
								flex: 1,
								alignSelf: 'flex-start',
								marginHorizontal: 'auto'
								// borderColor: isFilterSelected(field, value)
								//   ? theme.black
								//   : 'transparent'
								// // backgroundColor:
							}}
						/>
					</View>
				)}

				{filters
					?.filter(f => !f?.isDate) //* <-- avoid show date filters
					?.map(({ field, label, boolean }) => {
						// if (boolean) return null //* hide from here and show in outside the modal
						return (
							<View key={label}>
								<Text style={[gStyles.h3, { marginBottom: 0, marginTop: 6 }]}>{label}</Text>
								<View style={styles.filters}>
									{Object.keys(createFieldFilters(field as string, boolean)).map(value => {
										if (!value) return null
										if (value === 'undefined') return null
										const title = chipLabel(field as string, value) //<-- avoid shows empty chips

										if (!title) return null
										const iconValues = chipIconType(value as OrderType['type'])
										return (
											<Chip
												color={chipColor(field as string, value)}
												title={title}
												key={value}
												size="sm"
												icon={iconValues?.icon}
												titleColor={iconValues?.color}
												onPress={() => {
													if (value === 'REPORTED') {
														filterBy('isReported', true)
														return
													}
													if (boolean) {
														filterBy(field as string, value === 'true')
														return
													}
													filterBy(field as string, value)
												}}
												style={{
													margin: 4,
													borderWidth: 4,
													borderColor: isFilterSelected(field, value) ? theme.black : 'transparent'
													// backgroundColor:
												}}
											/>
										)
									})}
								</View>
							</View>
						)
					})}
			</StyledModal>
		</View>
	)
}

export default function <T>(props: ModalFilterOrdersProps<T>) {
	return (
		<ErrorBoundary componentName="ModalFilterList">
			<ModalFilterList {...props} />
		</ErrorBoundary>
	)
}

export function ModalFilterListE<T>(props: ModalFilterOrdersProps<T>) {
	return (
		<ErrorBoundary componentName="ModalFilterList">
			<ModalFilterList {...props} />
		</ErrorBoundary>
	)
}

const styles = StyleSheet.create({
	filters: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }
})
