import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import useFilter from '../hooks/useFilter'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import Chip from './Chip'
import theme, { ORDER_TYPE_COLOR, STATUS_COLOR } from '../theme'
import dictionary, { Labels } from '../dictionary'
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import InputTextStyled from './InputTextStyled'
import { formatDate } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { useStore } from '../contexts/storeContext'
import Button from './Button'
export type CollectionSearch = {
  collectionName: string
  fields: string[]
}
export type FilterListType<T> = {
  field: keyof T
  label: string
  boolean?: boolean
}

export type ModalFilterOrdersProps<T> = {
  data: T[]
  setData: (orders: T[]) => void
  filters?: FilterListType<T>[]
  preFilteredIds: string[]
  collectionSearch?: CollectionSearch
}

function ModalFilterList<T>({
  data,
  filters,
  setData = (data) => console.log(data),
  preFilteredIds,
  collectionSearch
}: ModalFilterOrdersProps<T>) {
  const { storeSections, staff } = useStore()
  const filterModal = useModal({ title: 'Filtrar por' })

  const { filterBy, cleanFilter, filteredData, filtersBy, search } =
    useFilter<T>({
      data,
      collectionSearch
    })

  useEffect(() => {
    setData?.(filteredData)
  }, [filteredData])

  const [customFilterSelected, setCustomFilterSelected] = useState(false)

  useEffect(() => {
    if (preFilteredIds?.length) {
      filterBy('customIds', preFilteredIds)
      setCustomFilterSelected(true)
    }
  }, [preFilteredIds])

  const isFilterSelected = (field, value) => {
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

    return theme.info
  }

  const chipLabel = (field: string, value: string) => {
    //* this is useful for orders table to find section name
    if (field === 'assignToSection') {
      const res = storeSections.find((a) => a.id === value)?.name || ''

      return dictionary(res as Labels).toUpperCase()
    }
    //* this is useful for payments table to find staff name
    if (field === 'userId') {
      const staffFound = staff?.find((a) => a.userId === value)
      return staffFound?.name || ''
    }

    return dictionary(value as Labels).toUpperCase()
  }

  const [searchValue, setSearchValue] = useState('')

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
            setSearchValue(e)
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
                  cleanFilter()
                  setSearchValue('')
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

        {filters?.map(({ field, label, boolean }, i) => (
          <View key={i}>
            <Text style={[gStyles.h3]}>{label}</Text>
            <View style={styles.filters}>
              {Object.keys(createFieldFilters(field as string, boolean)).map(
                (value) => {
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
                }
              )}
            </View>
          </View>
        ))}
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

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }
})
