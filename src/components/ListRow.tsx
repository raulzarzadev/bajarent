import { StyleSheet, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import theme from '../theme'
export type ListRowField = {
  field: string
  width: ViewStyle['width']
  component: ReactNode
}

const ListRow = ({
  fields,
  style
}: {
  fields: ListRowField[]
  style?: ViewStyle
}) => {
  return (
    <View style={[styles.container, style]}>
      {fields.map(({ field, component, width }, i) => (
        <View key={i} style={{ width }}>
          {component}
        </View>
      ))}
    </View>
  )
}

export default ListRow

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: theme.neutral,
    width: '100%',
    maxWidth: 500,
    marginHorizontal: 'auto'
  }
})
