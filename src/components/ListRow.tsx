import { StyleSheet, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import theme from '../theme'
export type ListRowField = {
  width: ViewStyle['width'] | 'rest'
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
      {fields?.map(({ component, width }, i) => {
        let style = {}
        if (width === 'rest') {
          style = { flex: 1 }
        } else {
          style = { width }
        }
        return (
          <View key={i} style={style}>
            {component}
          </View>
        )
      })}
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
    // maxWidth: 500,
    marginHorizontal: 'auto',
    flexWrap: 'wrap'
  }
})
