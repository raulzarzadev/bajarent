import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from '../Button'
import theme from '../../theme'
import { isSameDay, isToday } from 'date-fns'
import { gSpace, gStyles } from '../../styles'
export type EventTime = `${string}:${string}`
export type Event = {
  id: string
  title: string
  date: Date
  time?: EventTime
}
const WeekTimeline = ({
  numberOfDays = 7,
  onSelectDate,
  dateSelected
}: {
  numberOfDays?: number
  onSelectDate?: (date: Date) => void
  dateSelected?: Date
}) => {
  const [date, setDate] = useState(new Date())
  const [weekStart, setWeekStart] = useState(new Date())
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  const handleSetWeek = (page) => {
    const newDate = new Date(date.setDate(date.getDate() + page * numberOfDays))
    setWeekStart(newDate)
  }
  const [_selectedDate, setSelectedDate] = useState<Date | null>(dateSelected)

  const onPressSlot = (date, hour) => {
    onSelectDate?.(date)
    setSelectedDate(date)
  }

  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Event 1',
      date: new Date(2024, 2, 14, 9)
    },
    {
      id: '2',
      title: 'Event 2',
      date: new Date(2024, 2, 15, 13)
    },
    {
      id: '3',
      title: 'Event 3',
      date: new Date(2024, 2, 15, 15)
    },
    {
      id: '4',
      title: 'Event 4',
      date: new Date(2024, 2, 16, 13)
    },
    {
      id: '5',
      title: 'Event 5',
      date: new Date(2024, 2, 16, 13)
    },
    {
      id: '6',
      title: 'Event 8',
      date: new Date(2024, 2, 16, 13)
    },
    {
      id: '7',
      title: 'Event 7',
      date: new Date(2024, 2, 13, 9)
    }
  ])

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
        <Text style={{ textAlign: 'center' }}>
          {month} {year}
        </Text>
        {!isToday(date) && (
          <Button
            label="hoy"
            onPress={() => {
              setDate(new Date())
              setWeekStart(new Date())
            }}
            size="xs"
            variant="ghost"
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
        dateSelected={_selectedDate}
        events={events}
        weekStart={weekStart}
        numberOfDays={numberOfDays}
        onPressSlot={onPressSlot}
      />
    </View>
  )
}

const EventsView = ({
  events,
  weekStart,
  numberOfDays,
  onPressSlot,
  dateSelected
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
      return (
        e.date.getDate() === date.getDate() &&
        e.date.getMonth() === date.getMonth() &&
        e.date.getHours() === slotHour
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
          <View key={i} style={{ marginVertical: gSpace(1) }}>
            {Array.from({ length: hours.length }, (_, i) => {
              return {
                name: 'event',
                start: new Date(),
                end: new Date()
              }
            }).map((event, i) => {
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
                    console.log({ eventId })
                  }}
                  width={width / numberOfDays - 10}
                  timeLabel={hours[i]}
                  events={slotEvents(_date, hours[i], events)}
                  slotSelected={slotSelected(_date, hours[i], dateSelected)}
                />
              )
            })}
          </View>
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
  slotSelected
}: {
  width: number
  timeLabel: string
  onPressSlot: () => void
  onPressEvent: (eventId: string) => void
  events: Event[]
  slotSelected?: boolean
}) => {
  return (
    <Pressable
      onPress={onPressSlot}
      style={[
        {
          minHeight: 50,
          width,
          justifyContent: 'flex-end',
          borderBottomColor: 'black',
          borderBottomWidth: 0.3
        }
      ]}
    >
      <View>
        {slotSelected && <Text style={styles.event}>Seleccionado</Text>}
        {events?.map((e) => (
          <Pressable
            style={styles.event}
            key={e.id}
            onPress={() => onPressEvent(e.id)}
          >
            <Text style={{ textAlign: 'center' }}>{e.title}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={gStyles.helper}>{timeLabel}</Text>
    </Pressable>
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