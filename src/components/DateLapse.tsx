import { View, Text } from 'react-native'
import React from 'react'
import DateCounts from './DateCounts'
import HeaderDate from './HeaderDate'
import Button from './Button'
import InputDate from './InputDate'

const DateLapse = () => {
  const [fromDate, setFromDate] = React.useState(new Date())
  const [toDate, setToDate] = React.useState(new Date())
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        margin: 'auto',
        maxWidth: 600
      }}
    >
      <InputDate
        setValue={(value) => {
          setFromDate(value)
        }}
        value={fromDate}
        format="EEE dd MMM yy"
        openButtonProps={{
          size: 'small',
          variant: 'ghost',
          uppercase: false
        }}
      />
      <InputDate
        setValue={(value) => {
          setToDate(value)
        }}
        value={toDate}
        format="EEE dd MMM yy"
        openButtonProps={{
          size: 'small',
          variant: 'ghost',
          uppercase: false
        }}
      />
    </View>
  )
}

export default DateLapse
