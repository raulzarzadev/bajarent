import { Text, View } from 'react-native'
import React from 'react'
import { dateFormat, fromNow } from '../libs/utils-date'
import { gStyles } from '../styles'
import SpanUser from './SpanUser'
import { Timestamp } from 'firebase/firestore'

const SpanMetadata = ({
  createdAt,
  createdBy,
  id,
  hidden
}: {
  createdAt: Date | Timestamp
  createdBy: string
  id: string
  hidden?: boolean
}) => {
  if (hidden) return null
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      <Text style={gStyles.helper}>
        {` ${dateFormat(createdAt, 'dd/MMM/yy HH:mm')} ${fromNow(createdAt)} `}
      </Text>
      <Text style={[gStyles.helper, { textAlign: 'center' }]}>
        <SpanUser userId={createdBy} />
      </Text>
      <Text style={gStyles.helper}> {id}</Text>
    </View>
  )
}

export default SpanMetadata
