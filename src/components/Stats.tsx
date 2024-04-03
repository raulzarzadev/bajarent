import { ScrollView } from 'react-native'
import StatsReports from './StatsReports'
import StatsOrders from './StatsOrders'

export default function Stats() {
  return (
    <ScrollView>
      <StatsOrders />
      <StatsReports />
    </ScrollView>
  )
}
