import { ScrollView, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ItemDetails from '../firebase/ItemDetails'
import Loading from './Loading'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import { ServiceItemHistory } from '../firebase/ServiceItemHistory'
import ListRow from './ListRow'
import DateCell from './DateCell'
import SpanUser from './SpanUser'
import dictionary from '../dictionary'
import SpanOrder from './SpanOrder'

const ScreenItemsDetails = ({ route }) => {
  const id = route?.params?.id
  const [item, setItem] = useState(undefined)
  const { items } = useStore()
  useEffect(() => {
    if (items) {
      setItem(items.find((item) => item.id === id) || null)
    }
  }, [route?.params?.id, items])

  if (item === undefined) {
    return <Loading />
  }
  if (item === null) {
    return <Text>Item not found</Text>
  }
  return (
    <ScrollView>
      <View style={gStyles.container}>
        <ItemDetails item={item} />
        <ItemHistory itemId={item.id} />
      </View>
    </ScrollView>
  )
}

const ItemHistory = ({ itemId }) => {
  const [itemHistory, setItemHistory] = useState([])
  const { storeId } = useStore()
  useEffect(() => {
    ServiceItemHistory.getLastEntries({
      itemId,
      count: 5,
      storeId: storeId
    }).then((res) => {
      setItemHistory(res)
    })
  }, [])
  console.log({ itemHistory })
  return (
    <View>
      <Text style={gStyles.h3}>Historial</Text>
      {itemHistory.map((entry) => (
        <ListRow
          key={entry.id}
          fields={[
            {
              component: <DateCell date={entry.createdAt} showTime />,
              width: 'rest'
            },
            {
              component: <SpanUser userId={entry?.createdBy} />,
              width: 'rest'
            },
            {
              component: <Text>{dictionary(entry?.type)}</Text>,
              width: 'rest'
            },
            {
              component: <SpanOrder orderId={entry?.orderId} redirect />,
              width: 'rest'
            }
          ]}
        />
      ))}
    </View>
  )
}

export default ScreenItemsDetails
