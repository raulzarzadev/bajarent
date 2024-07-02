import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button from './Button'
import { addDays } from 'date-fns'
import { gStyles } from '../styles'
import DateCell from './DateCell'
import useDebounce from '../hooks/useDebunce'

const HeaderDate = ({
  label,
  onChangeDate,
  showTime = false,
  documentDate,
  debounce = 0
}: {
  label: string
  onChangeDate: (date: Date) => void
  showTime?: boolean
  documentDate?: Date
  debounce?: number
}) => {
  const [date, setDate] = React.useState(new Date())

  const handleMoveDate = (days = 0) => {
    handleDebounce()
    const newDate = addDays(date, days)
    setDate(newDate)
    onChangeDate(newDate)
  }
  const [disabled, setDisabled] = React.useState(false)

  const handleDebounce = () => {
    setDisabled(true)
    setTimeout(() => {
      setDisabled(false)
    }, debounce)
  }

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          margin: 'auto'
        }}
      >
        <Button
          disabled={disabled}
          justIcon
          variant="ghost"
          icon="rowLeft"
          label="Atras"
          onPress={() => {
            handleMoveDate(-1)
          }}
        />
        <Text style={gStyles.h1}>{label}</Text>
        <Button
          disabled={disabled}
          justIcon
          variant="ghost"
          icon="rowRight"
          label="Adelante"
          onPress={() => {
            handleMoveDate(+1)
          }}
        />
      </View>
      <DateCell
        date={date}
        showTimeAgo={false}
        showTime={showTime}
        dateBold
        showDay
      />
      {!!documentDate && (
        <DateCell
          date={documentDate}
          showTimeAgo={false}
          showTime={true}
          showDate={false}
        />
      )}
    </View>
  )
}

export default HeaderDate

const styles = StyleSheet.create({})
