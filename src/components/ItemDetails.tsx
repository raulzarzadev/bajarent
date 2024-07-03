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

const ItemDetails = ({ item }: { item: Partial<ItemType> }) => {
  return (
    <View>
      <DocMetadata item={item} />

      <Text style={gStyles.h2}>Numero: {item.number}</Text>

      <Text style={[gStyles.tCenter, { marginVertical: 6 }]}>
        <Text style={gStyles.h3}>{asCapitalize(dictionary(item.status))}</Text>
      </Text>
      <View style={{ marginBottom: 8 }}>
        <ItemActions
          item={item}
          actions={['assign', 'fix', 'edit', 'delete']}
        />
      </View>

      <Text>
        Categoria:
        {item.categoryName}
      </Text>
      <Text>No.de serie: {item.serial}</Text>
      <Text>Marca: {item.brand}</Text>
      <Text>
        Area asignada:
        {item.assignedSectionName}
      </Text>
      <ItemFixDetails itemId={item?.id} />
    </View>
  )
}

export const ItemFixDetails = ({ itemId }: { itemId: string }) => {
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
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 4
        }}
      >
        <Text style={[gStyles.helper]}>{lastFixEntry}</Text>
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
