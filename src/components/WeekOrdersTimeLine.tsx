import { View } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import WeekTimeline, { Event } from './Calendars/WeekTimeline2'
import asDate from '../libs/utils-date'
import { STATUS_COLOR } from '../theme'
import dictionary from '../dictionary'
import { gStyles } from '../styles'
import { isAfter } from 'date-fns'
import ErrorBoundary from './ErrorBoundary'

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
  const events: Event[] =
    orders?.map((o) => ({
      date: o.scheduledAt,
      title: o.fullName,
      id: o.id,
      color: o.hasNotSolvedReports
        ? STATUS_COLOR.REPORTED
        : STATUS_COLOR[o.status],
      description: dictionary(o.status)
    })) || []

  const expiredOrders =
    orders.filter(
      (o) => isAfter(new Date(), asDate(o.expireAt)) // ? this is ok? should be show to or more days before to expireAt
    ) || []

  const expiredEvents: Event[] =
    expiredOrders?.map((o) => ({
      date: o.expireAt,
      title: o.fullName,
      id: o.id,
      color: o.hasNotSolvedReports
        ? STATUS_COLOR.REPORTED
        : STATUS_COLOR[o.status],
      description: dictionary(o.status)
    })) || []

  return (
    <View style={[gStyles.container, { padding: 4, marginTop: 0 }]}>
      <WeekTimeline
        currentEventId={orderId}
        events={[...events, ...expiredEvents]}
        numberOfDays={4}
        dateSelected={asDate(assignedDate)}
        onPressEvent={onPressOrder}
        onSelectDate={onSelectDate}
      />
    </View>
  )
}

export default function (props: WeekOrdersTimeLineProps) {
  return (
    <ErrorBoundary>
      <WeekOrdersTimeLine {...props} />
    </ErrorBoundary>
  )
}
