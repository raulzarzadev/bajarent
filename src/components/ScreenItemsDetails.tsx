import { ScrollView, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ItemDetailsE } from './ItemDetails'
import Loading from './Loading'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import {
  ItemHistoryType,
  ServiceItemHistory
} from '../firebase/ServiceItemHistory'
import ListRow from './ListRow'
import DateCell from './DateCell'
import SpanUser from './SpanUser'
import dictionary from '../dictionary'
import SpanOrder from './SpanOrder'
import { formatItems, useEmployee } from '../contexts/employeeContext'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'

const ScreenItemsDetails = ({ route }) => {
  const id = route?.params?.id
  console.log({ id })
  const [item, setItem] = useState(undefined)
  const { storeId, categories, storeSections } = useStore()
  const { employee } = useEmployee()

  useEffect(() => {
    if (employee) {
      fetchItem(id)
    }
    return () => {
      setItem(undefined)
    }
  }, [employee, id])

  const fetchItem = (id) => {
    ServiceStoreItems.get({ storeId, itemId: id }).then((res) => {
      const formatted = formatItems([res], categories, storeSections)
      setItem(formatted[0])
    })
  }

  if (item === undefined) {
    return <Loading />
  }
  if (item === null) {
    return <Text>Item not found</Text>
  }
  return (
    <ScrollView>
      <View style={gStyles.container}>
        <ItemDetailsE
          item={item}
          onAction={() => {
            fetchItem(id)
          }}
        />
        <ItemHistory itemId={item.id} />
      </View>
    </ScrollView>
  )
}

const ItemHistory = ({ itemId }) => {
  const [itemHistory, setItemHistory] = useState<ItemHistoryType[]>([])
  const { storeId } = useStore()
  const COUNT_HISTORY = 6
  useEffect(() => {
    ServiceItemHistory.listenLastEntries({
      itemId,
      storeId,
      callback: (res) => {
        setItemHistory(res)
      },
      count: COUNT_HISTORY
    })
  }, [])

  return (
    <View>
      <Text style={gStyles.h3}>Historial </Text>
      <Text style={[gStyles.helper, gStyles.tCenter, { marginBottom: 8 }]}>
        (últimos{COUNT_HISTORY})
      </Text>
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
              component: (
                <View>
                  <Text style={[gStyles.helper, gStyles.tBold]}>
                    {dictionary(entry?.type)}
                  </Text>
                  <Text style={gStyles.helper}>{entry?.content}</Text>
                </View>
              ),
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
