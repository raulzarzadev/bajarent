import { Text, View } from 'react-native'
import asDate, { dateFormat } from '../libs/utils-date'
import { gSpace, gStyles } from '../styles'
import { colors } from '../theme'
import type ItemType from '../types/ItemType'
import ErrorBoundary from './ErrorBoundary'
import Icon from './Icon'
import { ItemDetailsResumed, ItemFixDetailsE } from './ItemDetails'
export type CartItemType = {
  item: Partial<ItemType & { scheduledAt?: Date }>
  showAssignedSection?: boolean
  showFixTime?: boolean
  showFixNeeded?: boolean
  showScheduledTime?: boolean
  /**
   * @deprecated
   */
  showSerialNumber?: boolean
  /**
   * @deprecated
   */
  showRepairInfo?: boolean
}
const CardItem = ({
  item,
  showAssignedSection,
  showFixNeeded,
  showFixTime = true,
  showScheduledTime
}: CartItemType) => {
  const sectionName = item?.assignedSectionName || 'Sin asignar'

  return (
    <View
      style={{
        //justifyContent: 'space-between',
        flex: 1
      }}
    >
      <View
        style={{
          //height: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {showScheduledTime && item.scheduledAt ? (
          <Text style={[gStyles.tCenter, gStyles.helper]}>
            <Icon icon="calendar" size={8} />{' '}
            {dateFormat(asDate(item.scheduledAt), 'dd/MM Ha')?.toLowerCase()}
          </Text>
        ) : (
          <View></View>
        )}
      </View>
      <ItemDetailsResumed item={item} showStatus={false} />

      {showAssignedSection && (
        <Text style={[gStyles.tCenter]}>{sectionName}</Text>
      )}

      {showFixNeeded && item?.needFix && (
        <ItemFixDetailsE
          itemId={item?.id}
          size="sm"
          showTime={showFixTime}
          failDescription={item?.repairDetails?.failDescription}
        />
      )}
    </View>
  )
}

export type CardItemProps = CartItemType
export const CardItemE = (props: CardItemProps) => (
  <ErrorBoundary componentName="CardItem">
    <CardItem {...props} />
  </ErrorBoundary>
)

export const SquareItem = ({
  item,
  showAssignedSection,
  showSerialNumber,
  bgColor = colors.lightBlue
}: CartItemType & { bgColor?: string }) => {
  return (
    <View
      style={{
        width: 120,
        minHeight: 80,
        backgroundColor: bgColor,
        borderRadius: gSpace(2),
        margin: 2,
        padding: 4
      }}
    >
      <CardItemE
        item={item}
        showAssignedSection={showAssignedSection}
        showSerialNumber={showSerialNumber}
      />
    </View>
  )
}

export default CardItem
