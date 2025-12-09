import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { endDate, startDate } from '../libs/utils-date'
import { formatItemsFromRepair } from '../libs/workshop.libs'
import { gStyles } from '../styles'
import theme from '../theme'
import type OrderType from '../types/OrderType'
import DateLapse from './DateLapse'
import ErrorBoundary from './ErrorBoundary'
import { RowWorkshopItemsE } from './RowWorkshopItems'

const ScreenWorkshopHistory = () => {
	return (
		<ScrollView>
			<WorkshopHistoryExternalRepairs />
		</ScrollView>
	)
}

const WorkshopHistoryExternalRepairs = () => {
	const [fromDate, setFromDate] = useState(startDate(new Date()))
	const [toDate, setToDate] = useState(endDate(new Date()))

	return (
		<View>
			<DateLapse setFromDate={setFromDate} setToDate={setToDate} />
			<Text style={gStyles.h3}>De reparación</Text>
			<RepairOrdersReport fromDate={startDate(fromDate)} toDate={endDate(toDate)} />
			{/* <RepairedRentItems fromDate={fromDate} toDate={toDate} /> */}
		</View>
	)
}

export const RepairOrdersReport = ({ fromDate, toDate }) => {
	const { storeId } = useStore()
	const [created, setCreated] = useState<Partial<OrderType[]>>([])
	const [cancelled, setCancelled] = useState<Partial<OrderType[]>>([])
	const [started, setStarted] = useState<Partial<OrderType[]>>([])
	const [finished, setFinished] = useState<Partial<OrderType[]>>([])
	useEffect(() => {
		if (storeId) {
			ServiceOrders.getRepairOrdersFlow({
				storeId,
				fromDate,
				toDate
			}).then(({ created, cancelled, started, finished }) => {
				setCreated(created)
				setCancelled(cancelled)
				setStarted(started)
				setFinished(finished)
			})
		}
	}, [storeId, fromDate, toDate])

	return (
		<ResumeRepairs cancelled={cancelled} created={created} finished={finished} started={started} />
	)
}

type List = 'created' | 'canceled' | 'started' | 'finished'
export const ResumeRepairs = ({
	created,
	cancelled,
	started,
	finished
}: {
	created: any[]
	cancelled: any[]
	started: any[]
	finished: any[]
}) => {
	const { categories, sections: storeSections } = useStore()
	const [items, setItems] = useState([])
	const [selectedOption, setSelectedOption] = useState<List>(null)
	const handleShowList = (list: List) => {
		if (selectedOption === list) {
			setSelectedOption(null)
			setItems([])
			return
		} else {
			setSelectedOption(list)
			const lists = {
				created: created,
				canceled: cancelled,
				started: started,
				finished: finished
			}

			const res = formatItemsFromRepair({
				repairOrders: lists[list],
				categories,
				storeSections
			})
			console.log({ res })
			setItems(res)
		}
	}

	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					width: '100%',
					justifyContent: 'space-around'
				}}
			>
				<OptionList
					label="Creadas"
					name={'created'}
					onPress={handleShowList}
					items={created}
					selectedOption={selectedOption}
				/>
				<OptionList
					label="Canceladas"
					name={'canceled'}
					onPress={handleShowList}
					items={cancelled}
					selectedOption={selectedOption}
				/>
				<OptionList
					label="Iniciadas"
					name={'started'}
					onPress={handleShowList}
					items={started}
					selectedOption={selectedOption}
				/>
				<OptionList
					label="Terminadas"
					name={'finished'}
					onPress={handleShowList}
					items={finished}
					selectedOption={selectedOption}
				/>
			</View>
			<View style={{ display: items?.length > 0 ? 'flex' : 'none' }}>
				<RowWorkshopItemsE items={items} title="Pedidos" />
			</View>
		</View>
	)
}

const OptionList = ({
	label,
	name,
	onPress,
	items,
	selectedOption
}: {
	label: string
	name: List
	onPress: (value: List) => void
	items: any[]
	selectedOption: List
}) => {
	return (
		<Pressable
			style={{
				borderWidth: 2,
				borderColor: name === selectedOption ? theme.accent : 'transparent',
				borderRadius: 8,
				width: 100,
				height: 40
			}}
			onPress={() => {
				onPress(name)
			}}
		>
			<Text style={{ textAlign: 'center' }}>{label}</Text>
			<Text style={{ textAlign: 'center' }}>{items.length}</Text>
		</Pressable>
	)
}

export const ScreenWorkshopHistoryE = props => (
	<ErrorBoundary componentName="ScreenWorkshopHistory">
		<ScreenWorkshopHistory {...props} />
	</ErrorBoundary>
)
export default ScreenWorkshopHistory
