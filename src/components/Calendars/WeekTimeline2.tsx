import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from '../Button'
import theme from '../../theme'
import { isSameDay, isToday } from 'date-fns'
import { gSpace, gStyles } from '../../styles'
import asDate from '../../libs/utils-date'
export type EventTime = `${string}:${string}`

export type Event = {
  id: string
  title: string
  date: Date
  time?: EventTime
  color?: string
  description?: string
}
export type WeekTimeLineProps = {
  currentEventId: string
  numberOfDays?: number
  onSelectDate?: (date: Date) => void
  dateSelected?: Date
  events: Event[]
  onPressEvent?: (eventId: string) => void
}

const WeekTimeline = ({
  currentEventId,
  numberOfDays = 7,
  onSelectDate,
  dateSelected,
  events = [],
  onPressEvent
}: WeekTimeLineProps) => {
  const [date, setDate] = useState(new Date())
  const [weekStart, setWeekStart] = useState(new Date())
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  const handleSetWeek = (page) => {
    const newDate = new Date(date.setDate(date.getDate() + page * numberOfDays))
    setWeekStart(newDate)
  }

  const [_selectedDate, setSelectedDate] = useState<Date | null>(dateSelected)

  const onPressSlot = (date: Date | null) => {
    onSelectDate?.(date)
    setSelectedDate(date)
  }

  return (
    <View style={{ marginVertical: gSpace(4) }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 40
        }}
      >
        <Button
          disabled={isToday(date)}
          label="hoy"
          onPress={() => {
            setDate(new Date())
            setWeekStart(new Date())
          }}
          size="xs"
          variant="ghost"
        ></Button>
        <Text style={{ textAlign: 'center' }}>
          {month} {year}
        </Text>
        {onSelectDate && (
          <Button
            label="Sin Fecha"
            variant="ghost"
            size="xs"
            disabled={!_selectedDate}
            onPress={() => {
              onPressSlot(null)
            }}
          ></Button>
        )}
      </View>
      <View style={{ flexDirection: 'row' }}>
        {/* back week  */}
        <Button
          size="xs"
          onPress={() => {
            handleSetWeek(-1)
          }}
          justIcon
          variant="ghost"
          icon="rowLeft"
        ></Button>
        {/* WEEK VIEW */}
        <WeekView
          weekStart={weekStart}
          numberOfDays={numberOfDays}
          date={date}
          onChangeDate={(date) => {
            setDate(date)
          }}
        />

        {/* next week */}
        <Button
          size="xs"
          onPress={() => {
            handleSetWeek(+1)
          }}
          justIcon
          variant="ghost"
          icon="rowRight"
        ></Button>
      </View>
      {/* EVENTS LIST VIEW */}
      <EventsView
        currentEventId={currentEventId}
        dateSelected={_selectedDate}
        events={events}
        weekStart={weekStart}
        numberOfDays={numberOfDays}
        onPressSlot={onPressSlot}
        onPressEvent={onPressEvent}
      />
    </View>
  )
}

const EventsView = ({
  events,
  weekStart,
  numberOfDays,
  onPressSlot,
  dateSelected,
  currentEventId = null,
  onPressEvent
}) => {
  const [daysOfWeek, setDaysOfWeek] = useState([])
  const [width, setWidth] = useState(0)

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout
    setWidth(width)
  }
  const hours = ['09:00', '11:00', '13:00', '15:00']

  useEffect(() => {
    setDaysOfWeek(
      Array.from({ length: numberOfDays }, (_, i) => {
        return new Date(
          weekStart.getFullYear(),
          weekStart.getMonth(),
          weekStart.getDate() + i
        )
      })
    )
  }, [weekStart])

  const slotEvents = (date: Date, hour: string, events: Event[]) => {
    const slotHour = parseInt(hour.split(':')[0])
    return events.filter((e) => {
      const eventDate = asDate(e?.date)
      return (
        eventDate?.getDate() === date?.getDate() &&
        eventDate?.getMonth() === date?.getMonth() &&
        eventDate?.getHours() === slotHour
      )
    })
  }

  const slotSelected = (date: Date, hour: string, dateSelected: Date) => {
    const slotHour = parseInt(hour.split(':')[0])

    return (
      dateSelected?.getDate() === date.getDate() &&
      dateSelected?.getMonth() === date.getMonth() &&
      dateSelected?.getHours() === slotHour
    )
  }

  return (
    <View
      onLayout={onLayout}
      style={{ justifyContent: 'space-evenly', flexDirection: 'row', flex: 1 }}
    >
      {daysOfWeek.map((_date: Date, i) => {
        return (
          <FlatList
            key={i}
            style={{ maxHeight: 300 }}
            data={Array.from({ length: hours.length }, (_, i) => {
              return { i }
            })}
            renderItem={({ item, index: i }) => {
              return (
                <SlotCell
                  key={i}
                  onPressSlot={() => {
                    onPressSlot(
                      new Date(
                        _date.setHours(parseInt(hours[i].split(':')[0]))
                      ),
                      hours[i]
                    )
                  }}
                  onPressEvent={(eventId) => {
                    onPressEvent?.(eventId)
                  }}
                  width={width / numberOfDays}
                  timeLabel={hours[i]}
                  events={slotEvents(_date, hours[i], events)}
                  currentEventId={currentEventId}
                  slotSelected={
                    currentEventId === null &&
                    slotSelected(_date, hours[i], dateSelected)
                  }
                />
              )
            }}
          />
        )
      })}
    </View>
  )
}

const SlotCell = ({
  width,
  timeLabel,
  onPressSlot,
  onPressEvent,
  events,
  slotSelected,
  currentEventId
}: {
  width: number
  timeLabel: string
  onPressSlot: () => void
  onPressEvent: (eventId: string) => void
  events: Event[]
  slotSelected?: boolean
  currentEventId: string
}) => {
  return (
    <View
      // onPress={onPressSlot}
      style={[
        {
          minHeight: 40,
          width,
          // maxHeight: 400,
          padding: 4
        }
      ]}
    >
      <View>
        <Pressable
          onPress={onPressSlot}
          style={{
            padding: 2,
            marginBottom: 2,
            backgroundColor: theme.white,
            borderTopColor: theme.info,
            borderTopWidth: 0.3,
            borderBottomStartRadius: 4,
            borderBottomEndRadius: 4
          }}
        >
          <Text style={[gStyles.helper, { textAlign: 'right' }]}>
            {timeLabel}
          </Text>
        </Pressable>

        {slotSelected && (
          <Text
            numberOfLines={1}
            style={[styles.event, { backgroundColor: theme.info }]}
          >
            Seleccionado
          </Text>
        )}

        {events?.map((e) => (
          <Pressable
            style={[
              styles.event,
              currentEventId === e.id && { backgroundColor: theme.info },
              e?.color && { backgroundColor: e?.color }
            ]}
            key={e.id}
            onPress={() => onPressEvent(e.id)}
          >
            <Text style={{ textAlign: 'center' }}>{e.title || 'Orden'}</Text>
            {e?.description && (
              <Text style={[gStyles.helper, { textAlign: 'center' }]}>
                {e?.description}
              </Text>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const WeekView = ({ weekStart, date, onChangeDate, numberOfDays }) => {
  const [daysOfWeek, setDaysOfWeek] = useState([])

  useEffect(() => {
    setDaysOfWeek(
      Array.from({ length: numberOfDays }, (_, i) => {
        return new Date(
          weekStart.getFullYear(),
          weekStart.getMonth(),
          weekStart.getDate() + i
        )
      })
    )
  }, [weekStart])

  return (
    <View
      style={{
        justifyContent: 'space-around',
        flexDirection: 'row',
        flex: 1
      }}
    >
      {daysOfWeek.map((_date, i) => {
        return (
          <Pressable
            onPress={() => {
              onChangeDate(_date)
            }}
            key={i}
            style={[
              styles.day,
              isToday(_date) && styles.today,
              isSameDay(_date, date) && styles.daySelected
            ]}
          >
            {/* Today week day as first list days */}
            <View>
              <Text style={{ textAlign: 'center' }}>
                {WeekDays[_date.getDay()].substring(0, 3)}
              </Text>
            </View>

            <View>
              <Text style={{ textAlign: 'center' }}>
                {daysOfWeek[i].getDate()}
              </Text>
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}

export default WeekTimeline

const styles = StyleSheet.create({
  day: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 999999,
    aspectRatio: 1,
    width: 44,
    padding: 2,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  today: {
    backgroundColor: theme.primary
  },
  daySelected: {
    borderColor: theme.secondary
  },
  event: {
    borderColor: 'black',
    borderWidth: 0.3,
    borderRadius: 4,
    marginVertical: 1
  }
})

const WeekDays = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
]
const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
]
