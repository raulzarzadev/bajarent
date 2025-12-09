import { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import { useStore } from '../contexts/storeContext'
import dictionary from '../dictionary'
import {
  type ItemHistoryType,
  ServiceItemHistory
} from '../firebase/ServiceItemHistory'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { formatItems } from '../libs/workshop.libs'
import { gStyles } from '../styles'
import Button from './Button'
import DateCell from './DateCell'
import { ItemDetailsE } from './ItemDetails'
import ListRow from './ListRow'
import Loading from './Loading'
import SpanOrder from './SpanOrder'
import SpanUser from './SpanUser'

const ScreenItemsDetails = ({ route }) => {
  const id = route?.params?.id
  const [item, setItem] = useState(undefined)
  const { storeId, categories, sections: storeSections } = useStore()
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
  const COUNT_HISTORY = 5
  const [count, setCount] = useState(COUNT_HISTORY)
  useEffect(() => {
    ServiceItemHistory.listenLastEntries({
      itemId,
      storeId,
      callback: (res) => {
        setItemHistory(res)
      },
      count
    })
  }, [count])

  return (
    <View>
      <Text style={gStyles.h3}>Historial </Text>

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
      <View style={{ marginTop: 8 }}>
        {count > itemHistory.length && (
          <Text style={{ textAlign: 'center' }}>Fin del historial</Text>
        )}
        <Button
          size="small"
          buttonStyles={{ margin: 'auto' }}
          onPress={() => {
            setCount(count + COUNT_HISTORY)
          }}
          label="Cargar más"
          disabled={count > itemHistory.length}
          icon="down"
        />
      </View>
    </View>
  )
}

export default ScreenItemsDetails
