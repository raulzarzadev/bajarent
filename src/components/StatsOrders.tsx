import {
	createDataset,
	groupDocsByDay,
	groupDocsByMonth,
	groupDocsByType,
	groupDocsByWeek,
	weekLabels
} from '../libs/chart-data'
import asDate, { dateFormat, months } from '../libs/utils-date'
import LineChart from './LineChart'
import theme, { ORDER_TYPE_COLOR } from '../theme'
import OrderType from '../types/OrderType'
import dictionary from '../dictionary'
import { setDayOfYear } from 'date-fns'

export default function StatsOrders({ view }: { view: string }) {
	const orders = []
	return (
		<>
			{view === 'month' && <MonthStats orders={orders} />}
			{view === 'week' && <WeekStats orders={orders} />}
			{view === 'last30days' && <Last30DaysStats orders={orders} />}
			{view === 'last7days' && <Last7DaysStats orders={orders} />}
		</>
	)
}
const Last7DaysStats = ({ orders }: { orders: OrderType[] }) => {
	const last7Days = orders?.filter(c => {
		const date = asDate(c.createdAt)
		const today = new Date()
		const last7 = new Date(today.setDate(today.getDate() - 7))
		return date > last7
	})

	const ordersByDays = groupDocsByDay({ docs: last7Days })
	const ordersByType = groupDocsByType({ docs: last7Days })

	const ordersLabels = Object.keys(ordersByDays).sort()

	const orderTypeDatasets = Object.entries(ordersByType).map(([type, orders]) => {
		const ordersByMonth = groupDocsByDay({ docs: orders })

		return createDataset({
			label: dictionary(type as OrderType['type']),
			color: ORDER_TYPE_COLOR[type],
			docs: ordersByMonth,
			labels: ordersLabels
		})
	})
	// console.log({ orderTypeDatasets })
	const orderByDayDataset = createDataset<OrderType>({
		label: 'Ordenes',
		color: theme.info,
		docs: ordersByDays,
		labels: ordersLabels
	})
	return (
		<>
			<LineChart
				title={'Ordenes'}
				labels={ordersLabels.map(day => {
					const date = setDayOfYear(new Date(), Number(day))
					return dateFormat(date, 'd MMM')
				})}
				datasets={[orderByDayDataset, ...orderTypeDatasets]}
			/>
		</>
	)
}
const Last30DaysStats = ({ orders }: { orders: OrderType[] }) => {
	const last30Days = orders?.filter(c => {
		const date = asDate(c.createdAt)
		const today = new Date()
		const last30 = new Date(today.setDate(today.getDate() - 30))
		return date > last30
	})

	const ordersByDays = groupDocsByDay({ docs: last30Days })
	const ordersByType = groupDocsByType({ docs: last30Days })

	const ordersLabels = Object.keys(ordersByDays).sort()

	const orderTypeDatasets = Object.entries(ordersByType).map(([type, orders]) => {
		const ordersByMonth = groupDocsByDay({ docs: orders })

		return createDataset({
			label: dictionary(type as OrderType['type']),
			color: ORDER_TYPE_COLOR[type],
			docs: ordersByMonth,
			labels: ordersLabels
		})
	})
	// console.log({ orderTypeDatasets })
	const orderByDayDataset = createDataset<OrderType>({
		label: 'Ordenes',
		color: theme.info,
		docs: ordersByDays,
		labels: ordersLabels
	})
	return (
		<>
			<LineChart
				title={'Ordenes'}
				labels={ordersLabels.map(day => {
					const date = setDayOfYear(new Date(), Number(day))
					return dateFormat(date, 'd MMM')
				})}
				datasets={[orderByDayDataset, ...orderTypeDatasets]}
			/>
		</>
	)
}
const MonthStats = ({ orders }: { orders: OrderType[] }) => {
	const sortMonths = (a: string, b: string) => months.indexOf(a) - months.indexOf(b)

	//* DATA SET FOR MONTHS
	const ordersByMonth = groupDocsByMonth({ docs: orders })
	const ordersByType = groupDocsByType({ docs: orders })
	const ordersLabels = Object.keys(ordersByMonth).sort(sortMonths)

	const orderTypeDatasets = Object.entries(ordersByType).map(([type, orders]) => {
		const ordersByMonth = groupDocsByMonth({ docs: orders })

		return createDataset({
			label: dictionary(type as OrderType['type']),
			color: ORDER_TYPE_COLOR[type],
			docs: ordersByMonth,
			labels: ordersLabels
		})
	})

	const allOrders = createDataset<OrderType>({
		label: 'Todas las ordenes',
		color: theme.info,
		docs: ordersByMonth,
		labels: ordersLabels
	})
	return (
		<LineChart title="Ordenes" labels={ordersLabels} datasets={[allOrders, ...orderTypeDatasets]} />
	)
}

const WeekStats = ({ orders }: { orders: OrderType[] }) => {
	const ordersByType = groupDocsByType({ docs: orders })
	const ordersByWeek = groupDocsByWeek({ docs: orders })
	const orderTypeDatasetsForWeeks = Object.entries(ordersByType).map(([type, orders]) => {
		const weeks = groupDocsByWeek({ docs: orders })
		const labelsWeeks = Object.keys(ordersByWeek)
		return createDataset({
			label: dictionary(type as OrderType['type']),
			color: ORDER_TYPE_COLOR[type],
			docs: weeks,
			labels: labelsWeeks
		})
	})
	//* create labels more Readable with month number and month
	const orderWeekLabels = weekLabels(Object.keys(ordersByWeek).map(Number))

	const allWeekOrders = createDataset<OrderType>({
		label: 'Todas las ordenes',
		color: theme.info,
		docs: ordersByWeek,
		labels: Object.keys(ordersByWeek)
	})
	return (
		<LineChart
			title="Ordenes"
			labels={orderWeekLabels}
			datasets={[allWeekOrders, ...orderTypeDatasetsForWeeks]}
		/>
	)
}
