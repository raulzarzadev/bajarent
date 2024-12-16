import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import React from 'react'
import ItemType from '../../types/ItemType'
const BalanceItemRow = (props: BalanceItemRowProps) => {
  const item = props.item

  return (
    <View>
      <Text>
        {item.eco} {item.categoryName}
      </Text>
    </View>
  )
}
export type BalanceItemRowProps = {
  item: ItemType
}
export const BalanceItemRowE = (props: BalanceItemRowProps) => (
  <ErrorBoundary componentName="BalanceItemRow">
    <BalanceItemRow {...props} />
  </ErrorBoundary>
)
export default BalanceItemRow
