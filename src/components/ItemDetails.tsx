import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import dictionary, { asCapitalize } from '../dictionary'
import {
  type ItemHistoryType,
  ServiceItemHistory
} from '../firebase/ServiceItemHistory'
import asDate, { dateFormat } from '../libs/utils-date'
import { gStyles } from '../styles'
import theme from '../theme'
import type ItemType from '../types/ItemType'
import DocMetadata from './DocMetadata'
import ErrorBoundary from './ErrorBoundary'
import ItemActions from './ItemActions'
import SpanUser from './SpanUser'

const ItemDetails = ({
  item,
  onAction,
  showFixTime = true
}: {
  item: Partial<ItemType>
  onAction?: () => void
  showFixTime?: boolean
}) => {
  return (
    <View>
      <DocMetadata
        item={item}
        style={{ flexDirection: 'row', justifyContent: 'space-between' }}
      />
      <View style={{ marginTop: 18 }} />
      <Text style={gStyles.h1}>{item.number}</Text>
      <Text style={gStyles.h2}>{item?.categoryName}</Text>
      <Text style={[gStyles.helper, { textAlign: 'center' }]}>
        {item.brand || 'sin marca'} - {item.serial || 'si serie'}
      </Text>

      <Text
        style={[
          gStyles.tCenter,
          {
            marginVertical: 6,
            backgroundColor: theme.info,
            borderRadius: 99,
            margin: 'auto',
            paddingVertical: 2,
            paddingHorizontal: 8
          }
        ]}
      >
        <Text style={gStyles.h1}>{asCapitalize(dictionary(item.status))}</Text>
      </Text>
      <Text
        style={{
          textAlign: 'center',
          justifyContent: 'center',
          marginVertical: 8
        }}
      >
        Ultimo inventario:{' '}
        {dateFormat(asDate(item?.lastInventoryAt), 'dd/MMM/yy HH:mm')} por{' '}
        <SpanUser userId={item?.lastInventoryBy} />
      </Text>

      {item.workshopStatus &&
        item.assignedSection === 'workshop' &&
        item.status === 'pickedUp' && (
          <Text style={[gStyles.tCenter, { marginBottom: 6 }]}>
            <Text style={gStyles.helper}>
              {asCapitalize(dictionary(item.workshopStatus))}
            </Text>
          </Text>
        )}

      <View style={{ marginBottom: 8 }}>
        <ItemActions
          item={item}
          actions={[
            'assign',
            'fix',
            'edit',
            'delete',
            'retire',
            'history',
            'inventory'
          ]}
          onAction={() => {
            onAction?.()
          }}
        />
      </View>

      {item?.needFix && (
        <View style={{ marginVertical: 12 }}>
          <ItemFixDetails itemId={item?.id} showTime={showFixTime} />
        </View>
      )}
    </View>
  )
}

export const ItemFixDetails = ({
  itemId,
  size = 'lg',
  showTime = true,
  failDescription
}: ItemFixDetailsProps) => {
  const [lastFixEntry, setLastFixEntry] = useState<ItemHistoryType>()
  const { storeId } = useStore()

  useEffect(() => {
    //* FIXME: here you are make one call for
    ServiceItemHistory.getLastEntries({
      itemId,
      storeId,
      count: 1,
      type: 'report'
    }).then((res) => {
      setLastFixEntry(res[0])
    })
  }, [])
  const textSize = {
    sm: 10,
    md: 14,
    lg: 18
  }

  if (failDescription)
    return (
      <Text
        style={[gStyles.tError, gStyles.tCenter, { fontSize: textSize[size] }]}
      >
        {failDescription}
      </Text>
    )
  if (lastFixEntry === undefined) return null
  return (
    <View>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
          //marginVertical: 12
        }}
      >
        <Text
          numberOfLines={3}
          style={[
            gStyles.tError,
            gStyles.tCenter,
            { fontSize: textSize[size] }
          ]}
        >
          {showTime
            ? dateFormat(lastFixEntry?.createdAt, 'dd/MMM/yy HH:mm ')
            : ''}{' '}
          {lastFixEntry.content}
        </Text>
      </View>
    </View>
  )
}

export type ItemFixDetailsProps = {
  itemId: string
  size?: 'sm' | 'md' | 'lg'
  showTime?: boolean
  failDescription?: string
}
export const ItemFixDetailsE = (props: ItemFixDetailsProps) => (
  <ErrorBoundary componentName="ItemFixDetails">
    <ItemFixDetails {...props} />
  </ErrorBoundary>
)

export const ItemDetailsE = (props) => (
  <ErrorBoundary componentName="ItemDetails">
    <ItemDetails {...props} />
  </ErrorBoundary>
)

export default ItemDetails
