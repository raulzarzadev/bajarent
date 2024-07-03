import React from 'react'
import { ListOrdersConsolidatedE } from './ListOrdersConsolidated'
import { ScrollView, View } from 'react-native'
import InputRadios from './InputRadios'

import ListItemsSections from './ListItemsSections'

const ScreenOrdersConsolidated = () => {
  const [view, setView] = React.useState<'orders' | 'items'>('orders')
  return (
    <ScrollView>
      <InputRadios
        layout="row"
        options={[
          { label: 'Ordenes', value: 'orders' },
          {
            label: 'Artículos disponibles',
            value: 'items'
          }
        ]}
        setValue={(value) => setView(value)}
        value={view}
      />
      {view === 'orders' && <ListOrdersConsolidatedE />}
      {view === 'items' && <ListItemsSections />}
    </ScrollView>
  )
}

export default ScreenOrdersConsolidated
