import { ScrollView } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import withDisabledCheck from './HOCs/withDisabledEmployeeCheck'
import { ListMyItemsE } from './ListMyItems'

const ScreenMyItems = () => {
	const { items } = useEmployee()
	return (
		<ScrollView>
			<ListMyItemsE items={items} />
		</ScrollView>
	)
}

export default withDisabledCheck(ScreenMyItems)
