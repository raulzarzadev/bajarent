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
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { formatItems } from '../libs/workshop.libs'
import { useEmployee } from '../contexts/employeeContext'
import InputTextStyled from './InputTextStyled'
import { set } from 'cypress/types/lodash'
import InputSelect from './InputSelect'

const ScreenItemsDetails = ({ route }) => {
  const id = route?.params?.id
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
  const [count, setCount] = useState(COUNT_HISTORY)
  const [disabled, setDisabled] = useState(false)
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
      <InputSelect
        disabled={disabled}
        placeholder="Ultimos X registros"
        options={[
          { label: 'Ultimos 5 registros', value: '5' },
          { label: 'Ultimos 20 registros', value: '20' },
          { label: 'Ultimos 50 registros', value: '50' },
          { label: 'Ultimos 100 registros', value: '100' },
          { label: 'Ultimos 200 registros', value: '200' },
          { label: 'Ultimos 500 registros', value: '500' }
        ]}
        onChangeValue={(value) => {
          setCount(parseInt(value))
          setDisabled(true)
          setTimeout(() => {
            setDisabled(false)
          }, 2000)
        }}
      />

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
