import { StyleSheet, View } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import WeekTimeline, { Event } from './Calendars/WeekTimeline2'
import asDate from '../libs/utils-date'
import { STATUS_COLOR } from '../theme'
import dictionary from '../dictionary'
import { gStyles } from '../styles'

type WeekOrdersTimeLineProps = {
  orders: OrderType[]
  orderId?: string
  assignedDate?: Date
  onSelectDate?: (date: Date) => void
  onPressOrder?: (orderId: string) => void
}

const WeekOrdersTimeLine = ({
  orders,
  orderId,
  assignedDate,
  onSelectDate,
  onPressOrder
}: WeekOrdersTimeLineProps) => {
  const events: Event[] = orders.map((o) => ({
    date: o.scheduledAt,
    title: o.fullName,
    id: o.id,
    color: o.hasNotSolvedReports
      ? STATUS_COLOR.REPORTED
      : STATUS_COLOR[o.status],
    description: dictionary(o.status)
  }))
  return (
    <View style={gStyles.container}>
      <WeekTimeline
        currentEventId={orderId}
        events={events}
        numberOfDays={4}
        dateSelected={asDate(assignedDate)}
        onPressEvent={onPressOrder}
        onSelectDate={onSelectDate}
      />
    </View>
  )
}

export default WeekOrdersTimeLine

const styles = StyleSheet.create({})
