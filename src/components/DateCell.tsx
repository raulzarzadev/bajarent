import { Text, View } from 'react-native'
import React from 'react'
import { Timestamp } from 'firebase/firestore'
import asDate, { dateFormat, fromNow } from '../libs/utils-date'
import { gStyles } from '../styles'

const DateCell = ({
  date,
  label,
  showTime,
  labelBold,
  showTimeAgo = true
}: {
  label?: string
  date: Date | Timestamp | number | string
  showTime?: boolean
  labelBold?: boolean
  showTimeAgo?: boolean
}) => {
  return (
    <View>
      {label && (
        <Text style={[gStyles.tCenter, labelBold && gStyles.tBold]}>
          {label}
        </Text>
      )}
      <Text style={[gStyles.tCenter]}>
        {dateFormat(asDate(date), 'dd-MMM-yy')}
      </Text>
      {showTime && (
        <Text style={[gStyles.tCenter, gStyles.helper]}>
          {dateFormat(asDate(date), 'HH:mm')}
        </Text>
      )}
      {showTimeAgo && (
        <Text style={[gStyles.tCenter]}>{fromNow(asDate(date))}</Text>
      )}
    </View>
  )
}

export default DateCell
