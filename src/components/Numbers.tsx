import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native'
import React from 'react'
import { gSpace, gStyles } from '../styles'
import theme from '../theme'
import { useStore } from '../contexts/storeContext'
import OrderType, { order_status, order_type } from '../types/OrderType'
import { isThisWeek, isToday } from 'date-fns'
import asDate, { isLastWeek } from '../libs/utils-date'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import OrdersList from './OrdersList'

type SquareItem = { title: string; value: number; orders: OrderType[] }

const Numbers = () => {
  const { orders, storeSections } = useStore()

  type FilterType = {
    field: keyof OrderType
    value: string | Date | boolean
    comparative?: '<' | '>' | '=' | '<=' | '>='
  }
  const filteredOrdersBy = (
    orders: OrderType[],
    filters: FilterType[] = []
  ) => {
    if (filters.length === 0) return orders
    return orders.filter((o) =>
      filters.every((f) => {
        const field = f.field as string
        if (f.value === 'today') {
          return isToday(asDate(o[field]))
        }
        if (f.value === 'thisWeek') {
          return isThisWeek(asDate(o[field]))
        }
        if (f.value === 'lastWeek') {
          return isLastWeek(asDate(o[field]))
        }
        return o[field] === f.value
      })
    )
  }

  const squaresToCreate: {
    title: string
    filters: FilterType[]
  }[] = [
    {
      title: 'Todas',
      filters: []
    },
    {
      title: 'Hoy',
      filters: [{ field: 'createdAt', value: 'today' }]
    },
    {
      title: 'Esta semana',
      filters: [{ field: 'createdAt', value: 'thisWeek' }]
    },
    {
      title: 'Semana pasada',
      filters: [{ field: 'createdAt', value: 'lastWeek' }]
    },
    {
      title: 'Pendiente',
      filters: [{ field: 'status', value: order_status.PENDING }]
    },
    {
      title: 'Autorizada',
      filters: [{ field: 'status', value: order_status.AUTHORIZED }]
    },

    {
      title: 'Reportada',
      filters: [{ field: 'hasNotSolvedReports', value: true }]
    },

    {
      title: 'Cancelada',
      filters: [{ field: 'status', value: order_status.CANCELLED }]
    }
  ]

  const repairOrders = filteredOrdersBy(orders, [
    { field: 'type', value: order_type.REPAIR }
  ])

  const rentOrders = filteredOrdersBy(orders, [
    { field: 'type', value: order_type.RENT }
  ])

  const numbersOrders = squaresToCreate.map((square) => {
    const res = filteredOrdersBy(orders, square.filters)
    return {
      title: square.title,
      value: res.length,
      orders: res
    }
  })

  const repairNumbers: SquareItem[] = squaresToCreate.map((square) => {
    const orders = filteredOrdersBy(repairOrders, square.filters)
    return {
      title: square.title,
      value: orders.length,
      orders
    }
  })

  const rentNumbers: SquareItem[] = squaresToCreate.map((square) => {
    const orders = filteredOrdersBy(rentOrders, square.filters)
    return {
      title: square.title,
      value: orders.length,
      orders
    }
  })

  const sectionNumbers = (sectionId: string) => {
    const sectionOrders = filteredOrdersBy(orders, [
      { field: 'assignToSection', value: sectionId }
    ])

    return squaresToCreate.map((square) => {
      const orders = filteredOrdersBy(sectionOrders, square.filters)
      return {
        title: square.title,
        value: orders.length,
        orders
      }
    })
  }
  return (
    <View style={[gStyles.container, { maxWidth: 1200, width: '100%' }]}>
      <Text style={[gStyles.h1, styles.sectionTitle]}>Ordenes</Text>
      <FlatList
        horizontal
        data={numbersOrders}
        renderItem={({ item }) => <NumberSquare item={item} />}
        keyExtractor={(item) => item.title}
      />
      <Text style={[gStyles.h1, styles.sectionTitle]}>Reparaciones </Text>
      <FlatList
        horizontal
        data={repairNumbers}
        renderItem={({ item }) => <NumberSquare item={item} />}
        keyExtractor={(item) => item.title}
      />
      <Text style={[gStyles.h1, styles.sectionTitle]}>Rentas </Text>
      <FlatList
        horizontal
        data={rentNumbers}
        renderItem={({ item }) => <NumberSquare item={item} />}
        keyExtractor={(item) => item.title}
      />
      {storeSections.map((section) => {
        return (
          <View key={section.id}>
            <Text style={[gStyles.h1, styles.sectionTitle]}>
              {section.name}
            </Text>
            <FlatList
              horizontal
              data={sectionNumbers(section.id)}
              renderItem={({ item }) => <NumberSquare item={item} />}
              keyExtractor={(item) => item.title}
            />
          </View>
        )
      })}
    </View>
  )
}

const NumberSquare = ({ item }: { item: SquareItem }) => {
  const modal = useModal({ title: item.title })
  return (
    <>
      <Pressable onPress={modal.toggleOpen}>
        <View style={styles.numberSquare}>
          <Text style={gStyles.h2}>{item.title}</Text>
          <Text style={[gStyles.h1, { textAlign: 'center' }]}>
            {item.value}
          </Text>
        </View>
      </Pressable>
      {modal.open && (
        <StyledModal {...modal} size="full">
          <View style={{}}>
            <OrdersList orders={item.orders || []} />
          </View>
        </StyledModal>
      )}
    </>
  )
}

export default Numbers

const styles = StyleSheet.create({
  sectionTitle: {
    textAlign: 'left',
    marginBottom: 0,
    marginTop: gSpace(2)
  },
  numberSquare: {
    backgroundColor: theme.primary,
    padding: gSpace(2),
    margin: gSpace(2),
    marginTop: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 90
  }
})
