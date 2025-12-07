import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import type { PriceType, TimeType } from '../types/PriceType'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'
import InputRadios from './InputRadios'
import InputCheckbox from './Inputs/InputCheckbox'
import InputTextStyled from './InputTextStyled'
export type FormPriceProps = {
	defaultPrice: Partial<PriceType>
	handleSubmit: ({ amount, title, time }: Partial<PriceType>) => Promise<any>
}
const FormPriceA = ({ defaultPrice, handleSubmit }: FormPriceProps) => {
	const [units, setUnits] = useState<TimeType>('minute')
	const [price, setPrice] = useState(0)
	const [quantity, setQuantity] = useState(1)
	const [title, setTitle] = useState('')
	const [itExpires, setItExpires] = useState(true)
	const [loading, setLoading] = useState(false)
	const [marketVisible, setMarketVisible] = useState(defaultPrice?.marketVisible || false)

	useEffect(() => {
		if (defaultPrice) {
			const defaultTime = defaultPrice?.time || ''
			const [qty, unit] = defaultTime.split(' ')
			setUnits(unit as TimeType)
			setQuantity(parseFloat(qty))
			setPrice(defaultPrice?.amount)
			setTitle(defaultPrice?.title)
			setMarketVisible(defaultPrice?.marketVisible)
		}
	}, [defaultPrice])

	const handleSetUnits = value => {
		setUnits(value)
	}

	const onSubmit = async () => {
		setLoading(true)
		await handleSubmit({
			title,
			time: itExpires ? `${quantity} ${units}` : null,
			amount: price,
			marketVisible,
			itExpires
		})
		setLoading(false)
	}

	const unitOptions: { label: string; value: TimeType }[] = [
		{ label: 'Minutos', value: 'minute' },
		{ label: 'Horas', value: 'hour' },
		{ label: 'Días', value: 'day' },
		{ label: 'Semanas', value: 'week' },
		{ label: 'Meses', value: 'month' }
	]

	return (
		<View>
			<View style={styles.input}>
				<InputTextStyled value={title} onChangeText={setTitle} placeholder="Título" />
			</View>
			<View>
				<InputCheckbox
					label="Por tiempo"
					setValue={value => {
						setItExpires(value)
					}}
					value={itExpires}
				/>
			</View>
			{itExpires && (
				<View>
					<View style={styles.input}>
						<InputTextStyled
							value={quantity.toString()}
							onChangeText={qty => {
								setQuantity(Number(qty))
							}}
							placeholder="Cantidad "
							type="number"
							helperText='Cantidad de "Minutos, Horas, Días, Semanas, Meses"'
						/>
					</View>
					<View style={styles.input}>
						<InputRadios
							containerStyle={{ flexWrap: 'wrap' }}
							layout="row"
							setValue={handleSetUnits}
							value={units}
							options={unitOptions}
						/>
					</View>
				</View>
			)}
			<View style={styles.input}>
				<InputTextStyled
					value={price.toString()}
					onChangeText={price => {
						setPrice(Number(price))
					}}
					placeholder=" $ Precio"
					type="number"
					helperText="$ Precio por totalidad del tiempo"
				/>
			</View>
			<View style={styles.input}>
				<InputCheckbox
					label="Visible en el mercado"
					setValue={setMarketVisible}
					value={marketVisible}
				/>
			</View>
			<View style={styles.input}>
				<Button disabled={loading} label="Agregar" onPress={onSubmit}></Button>
			</View>
		</View>
	)
}

export default function FormPrice(props: FormPriceProps) {
	return (
		<ErrorBoundary componentName="FormPrice">
			<FormPriceA {...props} />
		</ErrorBoundary>
	)
}

const styles = StyleSheet.create({
	input: {
		marginVertical: 8
	}
})
