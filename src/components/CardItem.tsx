import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import ItemType from '../types/ItemType'
import { gSpace, gStyles } from '../styles'
import Icon, { IconName } from './Icon'
import { colors } from '../theme'

const CardItem = ({ item }: { item: Partial<ItemType> }) => {
  return (
    <View
      style={{
        justifyContent: 'space-between'
      }}
    >
      <View
        style={{ height: 16, flexDirection: 'row', justifyContent: 'flex-end' }}
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
        {item.needFix && (
          <ItemIcon
            icon="wrench"
            iconColor={colors.red}
            badgeColor={colors.transparent}
          />
        )}
      </View>
      <Text numberOfLines={2} style={[gStyles.h3]}>
        {item.categoryName}
      </Text>
      <Text style={[gStyles.tCenter]}>{item.number} </Text>
    </View>
  )
}

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

export const SquareItem = ({ item }: { item: Partial<ItemType> }) => {
  return (
    <View
      style={{
        width: 120,
        height: 80,
        backgroundColor: colors.lightBlue,
        borderRadius: gSpace(2),
        margin: 2,
        padding: 4
      }}
    >
      <CardItem item={item} />
    </View>
  )
}

export default CardItem

const styles = StyleSheet.create({})
