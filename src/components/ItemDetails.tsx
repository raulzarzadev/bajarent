import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import ItemType from '../types/ItemType'
import { gStyles } from '../styles'
import DocMetadata from './DocMetadata'
import dictionary, { asCapitalize } from '../dictionary'
import { ServiceItemHistory } from '../firebase/ServiceItemHistory'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import ItemActions from './ItemActions'

const ItemDetails = ({
  item,
  onAction
}: {
  item: Partial<ItemType>
  onAction?: () => void
}) => {
  return (
    <View>
      <DocMetadata item={item} />

      <Text style={[gStyles.h2, { marginTop: 8 }]}>{item?.categoryName}</Text>
      <Text style={gStyles.h3}>{item.number}</Text>
      <Text style={[gStyles.helper, { textAlign: 'center' }]}>
        {item.brand || 'sin marca'} - {item.serial || 'si serie'}
      </Text>

      <Text style={[gStyles.tCenter, { marginVertical: 6 }]}>
        <Text style={gStyles.h1}>{asCapitalize(dictionary(item.status))}</Text>
      </Text>

      <View style={{ marginBottom: 8 }}>
        <ItemActions
          item={item}
          actions={['assign', 'fix', 'edit', 'delete', 'retire']}
          onAction={() => {
            onAction?.()
          }}
        />
      </View>

      {item?.needFix && (
        <View style={{ marginVertical: 12 }}>
          <ItemFixDetails itemId={item?.id} />
        </View>
      )}
    </View>
  )
}

export const ItemFixDetails = ({
  itemId,
  size = 'lg'
}: {
  itemId: string
  size?: 'sm' | 'md' | 'lg'
}) => {
  const [lastFixEntry, setLastFixEntry] = React.useState('')
  const { storeId } = useStore()

  useEffect(() => {
    ServiceItemHistory.getLastEntries({
      itemId,
      storeId,
      count: 1,
      type: 'report'
    }).then((res) => {
      setLastFixEntry(res[0]?.content)
    })
  }, [])
  const textSize = {
    sm: 10,
    md: 14,
    lg: 18
  }
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
          //marginVertical: 12
        }}
      >
        <Text
          numberOfLines={2}
          style={[
            gStyles.tError,
            gStyles.tCenter,
            { fontSize: textSize[size] }
          ]}
        >
          {lastFixEntry}
        </Text>
      </View>
    </View>
  )
}

export const ItemDetailsE = (props) => (
  <ErrorBoundary componentName="ItemDetails">
    <ItemDetails {...props} />
  </ErrorBoundary>
)

export default ItemDetails

const styles = StyleSheet.create({})
