import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button from './Button'
import { addDays } from 'date-fns'
import { gStyles } from '../styles'
import DateCell from './DateCell'
import useDebounce from '../hooks/useDebunce'
import InputDate from './InputDate'

const HeaderDate = ({
  label,
  onChangeDate,
  showTime = false,
  documentDate,
  debounce = 0,
  defaultDate = new Date()
}: {
  label?: string
  onChangeDate: (date: Date) => void
  showTime?: boolean
  documentDate?: Date
  debounce?: number
  defaultDate?: Date
}) => {
  const [date, setDate] = React.useState(defaultDate)

  const handleMoveDate = (days = 0) => {
    handleDebounce()
    const newDate = addDays(date, days)
    handleChangeDate(newDate)
  }
  const handleChangeDate = (newDate: Date) => {
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
      {!!label && <Text style={gStyles.h1}>{label}</Text>}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          margin: 'auto',
          alignItems: 'center'
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

        <InputDate
          setValue={(value) => {
            handleChangeDate(value)
          }}
          value={date}
          format="EEE dd MMM yy"
          openButtonProps={{
            size: 'small',
            variant: 'ghost',
            buttonStyles: { width: 180 },
            uppercase: false
          }}
        />
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

      {/* <DateCell
        date={date}
        showTimeAgo={false}
        showTime={showTime}
        dateBold
        showDay
      /> */}
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
