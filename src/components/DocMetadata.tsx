import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import asDate, { dateFormat } from '../libs/utils-date'
import SpanUser from './SpanUser'
import { gStyles } from '../styles'
import { Timestamp } from 'firebase/firestore'
export type DocMetadataType = {
  id?: string
  createdAt?: string | Date | Timestamp
  createdBy?: string
  updatedAt?: string | Date | Timestamp
  updatedBy?: string
  deletedAt?: string | Date | Timestamp
  deletedBy?: string
  deliveredAt?: string | Date | Timestamp
  deliveredBy?: string
  pickedUpAt?: string | Date | Timestamp
  pickedUpBy?: string
}
const DocMetadata = ({
  item,
  style
}: {
  item?: Partial<DocMetadataType>
  style: ViewStyle
}) => {
  return (
    <View style={[style]}>
      <Text style={gStyles.helper}>
        <Text style={[gStyles.tBold]}>id:</Text>
        {item?.id}
      </Text>
      <Meta label="createdAt" at={item?.createdAt} by={item?.createdBy} />
      <Meta label="updatedAt" at={item?.updatedAt} by={item?.updatedBy} />
      <Meta label="deletedAt" at={item?.deletedAt} by={item?.deletedBy} />
      <Meta label="deliveredAt" at={item?.deliveredAt} by={item?.deliveredBy} />
      <Meta label="pickedUpAt" at={item?.pickedUpAt} by={item?.pickedUpBy} />
    </View>
  )
}

const Meta = ({ at, by, label }) => {
  return (
    <>
      {!!at && (
        <Text style={gStyles.helper}>
          <Text style={gStyles.tBold}> {label}</Text>
          {dateFormat(asDate(at), 'ddMMMyy HH:mm')} by <SpanUser userId={by} />
        </Text>
      )}
    </>
  )
}

export default DocMetadata

const styles = StyleSheet.create({})
