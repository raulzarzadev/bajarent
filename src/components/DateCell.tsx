import { Text, View } from 'react-native'
import React from 'react'
import { Timestamp } from 'firebase/firestore'
import asDate, { dateFormat, fromNow } from '../libs/utils-date'
import { gStyles } from '../styles'

const DateCell = ({
  date,
  label
}: {
  label?: string
  date: Date | Timestamp | number | string
}) => {
  return (
    <View>
      {label && <Text style={[gStyles.tCenter]}>{label}</Text>}
      <Text style={[gStyles.tCenter]}>
        {dateFormat(asDate(date), 'dd-MMM-yy')}
      </Text>
      <Text style={[gStyles.tCenter]}>{fromNow(asDate(date))}</Text>
    </View>
  )
}

export default DateCell
