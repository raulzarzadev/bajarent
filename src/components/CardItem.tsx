import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ItemType from '../types/ItemType'
import { gSpace, gStyles } from '../styles'
import Icon, { IconName } from './Icon'
import { colors } from '../theme'
import { ItemFixDetails, ItemFixDetailsE } from './ItemDetails'
import asDate, { dateFormat } from '../libs/utils-date'
import ErrorBoundary from './ErrorBoundary'
export type CartItemType = {
  item: Partial<ItemType & { scheduledAt?: Date }>
  showAssignedSection?: boolean
  showSerialNumber?: boolean
  showFixTime?: boolean
  showFixNeeded?: boolean
  showScheduledTime?: boolean
  showRepairInfo?: boolean
}
const CardItem = ({
  item,
  showAssignedSection,
  showSerialNumber,
  showFixNeeded,
  showFixTime = true,
  showScheduledTime,
  showRepairInfo
}: CartItemType) => {
  const sectionName = item?.assignedSectionName || 'Sin asignar'
  console.log({ item })
  return (
    <View
      style={{
        //justifyContent: 'space-between',
        flex: 1
      }}
    >
      <View
        style={{
          height: 16,
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
        <View
          style={{
            height: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {item.status === 'rented' && (
            <ItemIcon
              icon="home"
              iconColor={colors.green}
              badgeColor={colors.transparent}
            />
          )}
          {item.status === 'pickedUp' && (
            <ItemIcon
              icon="truck"
              iconColor={colors.darkBlue}
              badgeColor={colors.transparent}
            />
          )}
          {item?.needFix && (
            <ItemIcon
              icon="wrench"
              iconColor={colors.red}
              badgeColor={colors.transparent}
            />
          )}
        </View>
      </View>

      <Text style={[gStyles.tCenter, gStyles.helper]}>
        {item.categoryName}{' '}
      </Text>
      <Text numberOfLines={2} style={[gStyles.h1]}>
        {item.number}
      </Text>
      {showSerialNumber && (
        <Text style={[gStyles.tCenter, gStyles.helper]}>{item.serial}</Text>
      )}
      {showAssignedSection && (
        <Text style={[gStyles.tCenter]}>{sectionName}</Text>
      )}
      {showRepairInfo && !!item?.repairInfo && (
        <Text
          style={[
            gStyles.tCenter,
            gStyles.tError,
            gStyles.helper,
            { marginVertical: 2 }
          ]}
          numberOfLines={3}
        >
          *{item?.repairInfo}
        </Text>
      )}
      {showFixNeeded && item?.needFix && (
        <ItemFixDetailsE itemId={item?.id} size="sm" showTime={showFixTime} />
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

const ItemIcon = ({
  icon,
  iconColor,
  badgeColor
}: {
  icon: IconName
  iconColor?: string
  badgeColor?: string
}) => {
  return (
    <View
      style={{
        width: 16,
        height: 16,
        borderRadius: 9999,
        backgroundColor: badgeColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 3
      }}
    >
      <Icon icon={icon} color={iconColor} size={12} />
    </View>
  )
}

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

const styles = StyleSheet.create({})
