import React from 'react'
import { ListOrdersConsolidatedE } from './ListOrdersConsolidated'
import { View } from 'react-native'
import InputRadios from './InputRadios'
import ListStoreItems from './ListStoreItems'
import ListItemsSections from './ListItemsSections'

const ScreenOrdersConsolidated = () => {
  const [view, setView] = React.useState<'orders' | 'items'>('orders')
  return (
    <View>
      <InputRadios
        layout="row"
        options={[
          { label: 'Ordenes', value: 'orders' },
          {
            label: 'Articulos',
            value: 'items'
          }
        ]}
        setValue={setView}
        value={view}
      />
      {view === 'orders' && <ListOrdersConsolidatedE />}
      {view === 'items' && <ListItemsSections />}
    </View>
  )
}

export default ScreenOrdersConsolidated
