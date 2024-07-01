import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from './Icon'
import InputDate from './InputDate'
import { gStyles } from '../styles'
import Button from './Button'
import { FilterListType } from './ModalFilterList'
import InputRadios from './InputRadios'

function FIlterByDate<T>({
  filters = [],
  onSubmit
}: {
  filters: FilterListType<T>[]
  onSubmit: (
    field: keyof T | '',
    dates: { fromDate: Date; toDate: Date }
  ) => void
}) {
  useEffect(() => {
    const dateFiltersValues = filters?.filter((f) => f.isDate)
    setDateFilters(
      dateFiltersValues.map((f) => ({ label: f.label, field: f.field }))
    )
  }, [])

  const [dateFilters, setDateFilters] = useState<
    { label: string; field: keyof T }[]
  >([])

  const [dateFieldSelected, setDateFieldSelected] = useState<keyof T | ''>('')

  const [fromDate, setFromDate] = useState<Date>(new Date())
  const [toDate, setToDate] = useState<Date>(new Date())
  const pickedDatesAsRow = Dimensions.get('window').width > 500
  return (
    <View>
      {dateFilters.length > 0 && (
        <View>
          {/* <Text style={gStyles.h3}>Filtrar por fechas</Text>
          <InputRadios
            layout="row"
            options={dateFilters.map((f) => ({
              label: f.label as string,
              value: f.field as string
            }))}
            value={dateFieldSelected as string}
            setValue={(value) => {
              setDateFieldSelected(value as keyof T | '')
            }}
          /> */}

          <View
            style={{
              flexDirection: pickedDatesAsRow ? 'row' : 'column',
              justifyContent: 'space-around',
              alignItems: 'center'
            }}
          >
            {!!dateFieldSelected && (
              <>
                {/* SELECT PERIOD OF TIME */}
                <View style={{ justifyContent: 'center', marginVertical: 4 }}>
                  <InputDate
                    format="E dd/MMM"
                    //withTime
                    label="Desde "
                    value={fromDate}
                    setValue={(value) => {
                      setFromDate(value)
                    }}
                  />
                </View>
                {pickedDatesAsRow && (
                  <View style={{ alignSelf: 'center' }}>
                    <Icon icon="rowRight" />
                  </View>
                )}
                <View style={{ justifyContent: 'center', marginVertical: 4 }}>
                  <InputDate
                    //withTime
                    format="E dd/MMM"
                    label="Hasta "
                    value={toDate}
                    setValue={(value) => {
                      setToDate(value)
                    }}
                  />
                </View>
                <Button
                  icon="search"
                  onPress={() => {
                    onSubmit(dateFieldSelected, { fromDate, toDate })
                  }}
                  size="small"
                  label={!pickedDatesAsRow ? 'Buscar' : ''}
                ></Button>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  )
}

export default FIlterByDate

const styles = StyleSheet.create({})
