import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import useFilter, { CollectionSearch } from '../hooks/useFilter'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import Chip from './Chip'
import theme, { ORDER_TYPE_COLOR, STATUS_COLOR, colors } from '../theme'
import dictionary, { Labels } from '../dictionary'
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import InputTextStyled from './InputTextStyled'
import { formatDate } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { useStore } from '../contexts/storeContext'
import Button from './Button'
import FIlterByDate from './FIlterByDate'
import { order_status, order_type } from '../types/OrderType'

export type FilterListType<T> = {
  field: keyof T
  label: string
  boolean?: boolean
  isDate?: boolean
}

export type ModalFilterOrdersProps<T> = {
  data: T[]
  setData: (orders: T[]) => void
  filters?: FilterListType<T>[]
  preFilteredIds: string[]
  collectionSearch?: CollectionSearch
  setCollectionData?: (data: T[]) => void
}

function ModalFilterList<T>({
  data,
  filters,
  setData = (data) => console.log(data),
  setCollectionData,
  preFilteredIds,
  collectionSearch
}: ModalFilterOrdersProps<T>) {
  const { storeSections, staff } = useStore()
  const filterModal = useModal({ title: 'Filtrar por' })

  const {
    filterBy,
    handleClearFilters,
    filteredData,
    customData,
    filtersBy,
    search,
    searchValue,
    filterByDates
  } = useFilter<T>({
    data,
    collectionSearch
  })

  useEffect(() => {
    setData?.(filteredData)
  }, [filteredData])

  useEffect(() => {
    setCollectionData?.(customData)
  }, [customData])

  const [customFilterSelected, setCustomFilterSelected] = useState(false)

  useEffect(() => {
    if (preFilteredIds?.length) {
      filterBy('customIds', preFilteredIds)
      setCustomFilterSelected(true)
    }
  }, [preFilteredIds])

  const isFilterSelected = (field, value) => {
    const isBoolean = value === 'true' || value === 'false'
    if (isBoolean) {
      return filtersBy.some(
        (a) => a.field === field && a.value === (value === 'true')
      )
    }
    if (field === 'status' && value === 'REPORTED') {
      return filtersBy.some((a) => a.field === 'hasNotSolvedReports' && a.value)
    }
    return filtersBy.some((a) => a.field === field && a.value === value)
  }

  let timerId = null

  const handleDebounceSearch = (e: string) => {
    if (timerId) {
      clearTimeout(timerId)
    }

    timerId = setTimeout(() => {
      search(e)
    }, 1000)
  }

  const createFieldFilters = (
    field: string,
    isBoolean?: boolean
  ): Record<string, T[]> => {
    const groupedByField = filteredData.reduce((acc, curr) => {
      let currField = curr?.[field]
      if (isBoolean) {
        currField = currField ? 'true' : 'false'
      }

      // if (isDate) {
      //   setFieldDates((filedDates) => [...filedDates, currField])
      //   return acc
      // }

      //* Avoid invalid fields
      if (!currField || currField === 'undefined') return acc

      if (currField instanceof Timestamp) {
        currField = formatDate(currField.toDate(), 'dd/MM/yy')
      }

      if (acc[currField]) {
        acc[currField].push(currField)
      } else {
        acc[currField] = [currField]
      }
      return acc
    }, {})

    return groupedByField
  }

  const chipColor = (field: string, value: string) => {
    //* FILTERS FOR COMMENTS
    if (field === 'type') {
      if (value === 'comment') return theme.info
      if (value === 'report') return theme.error
    }
    if (field === 'solved') {
      return value === 'true' ? theme.success : theme.error
    }

    //* this is useful for orders table to find status color
    if (field === 'status') {
      return STATUS_COLOR[value as keyof typeof STATUS_COLOR] || theme.base
    }
    //* this is useful for orders table to find type color
    if (field === 'type') {
      return (
        ORDER_TYPE_COLOR[value as keyof typeof ORDER_TYPE_COLOR] || theme.base
      )
    }

    if (field === 'colorLabel') {
      return value
    }

    return theme.info
  }

  const chipLabel = (field: string, value: string) => {
    //* this is useful for orders table to find section name

    if (
      field === 'type' &&
      [order_type.RENT, order_type.SALE, order_type.REPAIR].includes(
        value as order_type
      )
    ) {
      if (value === order_type.RENT) return 'RENTA ⏳ '
      if (value === order_type.SALE) return 'VENTA 💰 '
      if (value === order_type.REPAIR) return 'REPARACIÓN 🔧 '
    }

    if (field === 'status') {
      if (value === order_status.DELIVERED) return 'ENTREGADO 🏠 '
      if (value === order_status.REPAIRING) return 'REPARANDO 🛠️ '
      if (value === order_status.REPAIRED) return 'REPARADO ✅ '
      if (value === order_status.PICKED_UP) return 'RECOGIDO 🚛 '
      if (value === order_status.RENEWED) return 'RENOVADO 🔄 '
      if (value === order_status.CANCELLED) return 'CANCELADO ❌ '
      if (value === order_status.AUTHORIZED) return 'PEDIDO 🔖 '
      if (value === order_status.PENDING) return 'PENDIENTE'
      if (value === order_status.REPORTED) return 'REPORTADO'
    }

    if (field === 'assignToSection') {
      const res = storeSections.find((a) => a.id === value)?.name || ''

      return dictionary(res as Labels).toUpperCase()
    }
    if (field === 'colorLabel') {
      const res = Object.entries(colors).map(([key, value]) => ({
        color: value,
        label: key
      }))
      const color = res.find((a) => a.color === value)?.label || ''
      return dictionary(color as Labels).toUpperCase()
    }
    //* this is useful for payments table to find staff name
    if (field === 'userId') {
      const staffFound = staff?.find((a) => a.userId === value)
      return staffFound?.name || ''
    }

    return dictionary(value as Labels).toUpperCase()
  }

  return (
    <View>
      <View
        style={{
          flexDirection: 'row'
        }}
      >
        <InputTextStyled
          style={{ width: '100%', marginLeft: 4 }}
          placeholder="Buscar..."
          value={searchValue}
          onChangeText={(e) => {
            handleDebounceSearch(e)
          }}
        />
        {filters?.length > 0 && (
          <View style={{ marginLeft: 8 }}>
            <Button
              variant={!filtersBy?.length ? 'ghost' : 'filled'}
              color={!filtersBy?.length ? 'black' : 'primary'}
              icon="filter"
              onPress={() => {
                filterModal.toggleOpen()
              }}
              justIcon
            />
          </View>
        )}
      </View>

      <StyledModal {...filterModal}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ textAlign: 'center' }}>
            {filteredData.length} coincidencias
          </Text>
          {filtersBy?.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Button
                icon="broom"
                variant="ghost"
                color="secondary"
                onPress={() => {
                  handleClearFilters()
                  setCustomFilterSelected(false)
                }}
                justIcon
              />
              <Text style={{ fontSize: 10 }}>Todas</Text>
            </View>
          )}
        </View>

        {!!preFilteredIds?.length && (
          <View style={{ justifyContent: 'center' }}>
            <Chip
              color={theme.info}
              title={'Filtro pre-definido'}
              onPress={() => {
                filterBy('customIds', preFilteredIds)
                setCustomFilterSelected(!customFilterSelected)
              }}
              style={{
                margin: 4,
                borderWidth: 4,
                marginBottom: 8,
                borderColor: customFilterSelected ? theme.black : 'transparent',
                flex: 1,
                alignSelf: 'flex-start',
                marginHorizontal: 'auto'
                // borderColor: isFilterSelected(field, value)
                //   ? theme.black
                //   : 'transparent'
                // // backgroundColor:
              }}
            />
          </View>
        )}
        <FIlterByDate
          filters={filters}
          onSubmit={(field, dates) => {
            filterByDates(field as string, dates)
          }}
        />

        {filters
          ?.filter((f) => !f?.isDate) //* <-- avoid show date filters
          ?.map(({ field, label, boolean }, i) => {
            return (
              <View key={i}>
                <Text style={[gStyles.h3, { marginBottom: 0, marginTop: 6 }]}>
                  {label}
                </Text>
                <View style={styles.filters}>
                  {Object.keys(
                    createFieldFilters(field as string, boolean)
                  ).map((value) => {
                    if (!value) return null
                    if (value === 'undefined') return null
                    const title = chipLabel(field as string, value) //<-- avoid shows empty chips
                    if (!title) return null

                    return (
                      <Chip
                        color={chipColor(field as string, value)}
                        title={title}
                        key={value}
                        size="sm"
                        onPress={() => {
                          if (value === 'REPORTED') {
                            filterBy('isReported', true)
                            return
                          }
                          if (boolean) {
                            filterBy(field as string, value === 'true')
                            return
                          }
                          filterBy(field as string, value)
                        }}
                        style={{
                          margin: 4,
                          borderWidth: 4,
                          borderColor: isFilterSelected(field, value)
                            ? theme.black
                            : 'transparent'
                          // backgroundColor:
                        }}
                      />
                    )
                  })}
                </View>
              </View>
            )
          })}
      </StyledModal>
    </View>
  )
}

export default function <T>(props: ModalFilterOrdersProps<T>) {
  return (
    <ErrorBoundary componentName="ModalFilterList">
      <ModalFilterList {...props} />
    </ErrorBoundary>
  )
}

export function ModalFilterListE<T>(props: ModalFilterOrdersProps<T>) {
  return (
    <ErrorBoundary componentName="ModalFilterList">
      <ModalFilterList {...props} />
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }
})
