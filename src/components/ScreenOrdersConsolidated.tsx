import React from 'react'
import { ListOrdersConsolidatedE } from './ListOrdersConsolidated'
import { ScrollView } from 'react-native'
import withDisabledCheck from './HOCs/withDisabledEmployeeCheck'

const ScreenOrdersConsolidated = () => {
  return (
    <ScrollView>
      <ListOrdersConsolidatedE />
    </ScrollView>
  )
}

export default withDisabledCheck(ScreenOrdersConsolidated)
