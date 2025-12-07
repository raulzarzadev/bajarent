import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { expireDate2 } from '../libs/expireDate'
import { gSpace, gStyles } from '../styles'
import type { PriceType } from '../types/PriceType'
import type { CategoryType } from '../types/RentItem'
import CurrencyAmount from './CurrencyAmount'
import DateCell from './DateCell'
import FormSelectPrice from './FormSelectPrice'
import InputCount from './InputCount'
import InputRadios from './InputRadios'
import InputTextStyled from './InputTextStyled'

export type ItemSelected = {
	model?: string
	categoryId?: string
	failDescription?: string
	categoryName?: string
	/**
	 * @deprecated user priceSelected.id instead
	 */
	priceSelectedId?: string
	priceQty?: number
	priceSelected?: Partial<PriceType>
	id?: string
	brand?: string
	serial?: string
	number?: string

	// priceId?: string
	// timestamp?: Date
}

const FormSelectItem = ({
	categories = [],
	setValue,
	value,
	label = 'Categorias',
	selectPrice = false,
	startAt,
	showDetails = true,
	showCount = true,
	askItemInfo = false
}: {
	categories: Partial<CategoryType>[]
	setValue: (value: ItemSelected) => void
	value: ItemSelected
	label?: string
	selectPrice?: boolean
	startAt?: Date
	showDetails?: boolean
	showCount?: boolean
	askItemInfo?: boolean
}) => {
	const [brand, setBrand] = useState<string | null>(null)
	const [serial, setSerial] = useState<string | null>(null)

	const [categoryId, setCategoryId] = useState<ItemSelected['categoryName'] | null>(
		value?.categoryName || null
	)

	useEffect(() => {
		setCategoryId(value?.categoryName)
	}, [value?.categoryName])

	const [priceId, setPriceId] = useState<ItemSelected['priceSelectedId'] | null>(
		value?.priceSelectedId || null
	)
	const [amount, setAmount] = useState<number | null>(null)

	const [shouldExpireAt, setShouldExpireAt] = useState<Date | null>(null)

	const prices = categories?.find(category => category?.name === categoryId)?.prices || []

	const handleSelectPrice = (priceId: string) => {
		if (priceId === value.priceSelectedId) {
			setPriceId(null)
			setValue({
				categoryName: categoryId,
				priceSelectedId: null,
				priceQty: 0,
				brand,
				serial
			})
		} else {
			setPriceId(priceId)
			setValue({
				categoryName: categoryId,
				priceSelectedId: priceId,
				priceQty: 1,
				brand,
				serial
			})
		}
	}

	const handleSelectCategory = (item: string) => {
		setCategoryId(item)
		setValue({ categoryName: item as string, priceSelectedId: null })
	}

	const handleSetQty = (qty: number) => {
		setValue({ ...value, priceQty: qty })
	}

	useEffect(() => {
		const total = (value?.priceQty || 0) * (value?.priceSelected?.amount || 0)
		setAmount(total)
	}, [value])

	useEffect(() => {
		const expireAt = expireDate2({
			startedAt: startAt || new Date(),
			price: value?.priceSelected,
			priceQty: value?.priceQty || 0
		})
		setShouldExpireAt(expireAt)
	}, [amount, startAt])

	return (
		<View>
			<View>
				<InputRadios
					layout="row"
					options={categories.map(category => ({
						label: category?.name,
						value: category?.name
					}))}
					setValue={item => {
						handleSelectCategory(item)
					}}
					value={categoryId}
					label={label}
					containerStyle={{ flexWrap: 'wrap', justifyContent: 'center' }}
				/>
			</View>
			{askItemInfo && value?.categoryName && (
				<View style={{ marginVertical: gSpace(2) }}>
					<InputTextStyled
						placeholder="Marca"
						value={brand}
						onChangeText={text => setBrand(text)}
						helperText="Ejemplo: HP, Mytag, Mac, etc."
						containerStyle={{ marginBottom: gSpace(2) }}
					/>
					<InputTextStyled
						placeholder="No. de serie"
						value={serial}
						onChangeText={text => setSerial(text)}
						helperText="Ejemplo: ABC-34567890, 0987654321, etc."
					/>
				</View>
			)}
			{selectPrice && (
				<View>
					<FormSelectPrice
						value={priceId || null}
						setValue={priceId => {
							handleSelectPrice(priceId)
						}}
						prices={prices}
					/>
				</View>
			)}

			{showCount && !!value?.priceSelected && (
				<View style={{ marginVertical: gSpace(2) }}>
					<InputCount value={value?.priceQty || 0} setValue={handleSetQty} label="Cantidad" />
					<Text style={[gStyles.helper, gStyles.tCenter]}>Agrega tiempo a este item</Text>
				</View>
			)}
			{showDetails && (
				<>
					{!!amount && <CurrencyAmount amount={amount} style={gStyles.h1} />}
					{!!amount && shouldExpireAt && (
						<View style={{ alignItems: 'center', alignContent: 'center' }}>
							<Text>Vence:</Text>
							<DateCell date={shouldExpireAt} />
						</View>
					)}
				</>
			)}
		</View>
	)
}

export default FormSelectItem
