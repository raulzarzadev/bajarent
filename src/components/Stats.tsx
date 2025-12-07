import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import InputSelect from './InputSelect'
import StatsOrders from './StatsOrders'
import StatsReports from './StatsReports'

export default function Stats() {
	const [view, setView] = useState('last7days')
	return (
		<ScrollView>
			<View
				style={{
					padding: 4,
					justifyContent: 'flex-end',
					maxWidth: 160,
					alignSelf: 'flex-end'
				}}
			>
				<InputSelect
					onChangeValue={value => {
						setView(value)
					}}
					value={view}
					options={[
						{
							label: 'Por mes',
							value: 'month'
						},
						{
							label: 'Por semana',
							value: 'week'
						},
						{
							label: 'Últimos 30 días',
							value: 'last30days'
						},
						{
							label: 'Últimos 7 días',
							value: 'last7days'
						}
					]}
				/>
			</View>
			<StatsOrders view={view} />
			<StatsReports view={view} />
		</ScrollView>
	)
}
