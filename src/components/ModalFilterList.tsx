import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import ButtonIcon from './ButtonIcon'
import useFilter from '../hooks/useFilter'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import Chip from './Chip'
import theme from '../theme'
import dictionary, { Labels } from '../dictionary'
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import InputTextStyled from './InputTextStyled'
import { formatDate } from 'date-fns'
import { Timestamp } from 'firebase/firestore'

export type FilterListType<T> = { field: keyof T; label: string }

export type ModalFilterOrdersProps<T> = {
  data: T[]
  setData: (orders: T[]) => void
  filters?: FilterListType<T>[]
}

function ModalFilterList<T>({
  data,
  setData = (data) => console.log(data),
  filters
}: ModalFilterOrdersProps<T>) {
  const filterModal = useModal({ title: 'Filtrar por' })

  const { filterBy, cleanFilter, filteredData, filtersBy, search } =
    useFilter<T>({
      data
    })

  useEffect(() => {
    setData?.(filteredData)
  }, [filteredData])

  const isFilterSelected = (field, value) => {
    return filtersBy.some((a) => a.field === field && a.value === value)
  }

  let timerId = null

  const handleDebounceSearch = (e: string) => {
    if (timerId) {
      clearTimeout(timerId)
    }

    timerId = setTimeout(() => {
      search(e)
    }, 300)
  }

  const fieldOps = (field: string): Record<string, T[]> => {
    const groupedByField = filteredData.reduce((acc, curr) => {
      let currField = curr[field]

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

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <InputTextStyled
          style={{ width: '100%', marginLeft: 4 }}
          placeholder="Buscar..."
          onChangeText={(e) => {
            handleDebounceSearch(e)
          }}
        />
        <View style={{ marginLeft: 8 }}>
          <ButtonIcon
            variant={!filtersBy?.length ? 'ghost' : 'filled'}
            color={!filtersBy?.length ? 'black' : 'primary'}
            icon="filter"
            onPress={() => {
              filterModal.toggleOpen()
            }}
          />
        </View>
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
            {filteredData.length} conicidencias
          </Text>
          {filtersBy?.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ButtonIcon
                icon="broom"
                type="material-community"
                buttonStyles={{ margin: 8 }}
                variant="ghost"
                onPress={cleanFilter}
                color="secondary"
              ></ButtonIcon>
              <Text style={{ fontSize: 10 }}>Todas</Text>
            </View>
          )}
        </View>

        {filters?.map(({ field, label }, i) => (
          <View key={i}>
            <Text style={[gStyles.h3]}>Por {label}</Text>
            <View style={styles.filters}>
              {Object.keys(fieldOps(field as string)).map((value) => (
                <Chip
                  color={theme.base}
                  title={dictionary(value as Labels)?.toUpperCase() || ''}
                  key={value}
                  onPress={() => {
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
              ))}
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
