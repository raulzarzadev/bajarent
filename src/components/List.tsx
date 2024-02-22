import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import useSort from '../hooks/useSort'
import { FC, useState } from 'react'
import Icon from './Icon'

import { gSpace } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import ModalFilterList, { FilterListType } from './ModalFilterList'
import Button from './Button'

export type ListPops<T extends { id: string }> = {
  data: T[]
  onPressRow?: (orderId: string) => void
  sortFields?: { key: string; label: string }[]
  ComponentRow: FC<{ item: T }>
  defaultSortBy?: keyof T
  filters: FilterListType<T>[]
  defaultOrder?: 'asc' | 'des'
  onPressNew?: () => void
}

function MyList<T extends { id: string }>({
  data,
  onPressRow,
  sortFields,
  ComponentRow,
  defaultSortBy,
  defaultOrder = 'asc',
  filters,
  onPressNew
}: ListPops<T>) {
  const [filteredData, setFilteredData] = useState<T[]>([])

  const { sortBy, order, sortedBy, sortedData } = useSort<T>({
    data: filteredData,
    defaultSortBy: defaultSortBy as string,
    defaultOrder
  })

  return (
    <>
      <View style={[styles.container, { maxWidth: 1024 }]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: 500,
            padding: 4
          }}
        >
          {onPressNew && (
            <Button icon="add" label="" onPress={onPressNew} size="xs"></Button>
          )}
          <ModalFilterList
            data={data}
            setData={setFilteredData}
            filters={filters}
          />
        </View>
        <View>
          <Text style={{ textAlign: 'center' }}>
            {filteredData.length} conicidencias
          </Text>
        </View>
        <View
          style={{
            padding: 4,
            justifyContent: 'center',
            marginTop: gSpace(2)
          }}
        >
          <FlatList
            horizontal
            data={sortFields}
            renderItem={({ item: field }) => (
              <View key={field.key}>
                <Pressable
                  onPress={() => {
                    sortBy(field.key)
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: 4,
                    width: 65
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontWeight: sortedBy === field.key ? 'bold' : 'normal'
                    }}
                  >
                    {field.label}
                  </Text>
                  {sortedBy === field.key && (
                    <Icon icon={order === 'asc' ? 'up' : 'down'} size={12} />
                  )}
                </Pressable>
              </View>
            )}
          />
        </View>
        <FlatList
          style={styles.orderList}
          data={sortedData}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onPressRow && onPressRow(item?.id)
              }}
            >
              <ComponentRow item={item} />
            </Pressable>
          )}
        ></FlatList>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderList: {
    width: '100%',
    paddingHorizontal: 4
  }
})

export default function List<T extends { id: string }>(props: ListPops<T>) {
  return (
    <ErrorBoundary>
      <MyList {...props}></MyList>
    </ErrorBoundary>
  )
}
