import { ScrollView, View } from 'react-native'
import StatsReports from './StatsReports'
import StatsOrders from './StatsOrders'
import { useState } from 'react'
import InputSelect from './InputSelect'

export default function Stats() {
  const [view, setView] = useState('week')
  return (
    <ScrollView>
      <View
        style={{
          padding: 4,
          justifyContent: 'flex-end',
          maxWidth: 140,
          alignSelf: 'flex-end'
        }}
      >
        <InputSelect
          onChangeValue={(value) => {
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
            }
          ]}
        />
      </View>
      <StatsOrders view={view} />
      <StatsReports view={view} />
    </ScrollView>
  )
}
