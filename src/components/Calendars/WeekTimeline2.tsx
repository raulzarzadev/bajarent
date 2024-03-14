import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from '../Button'
import theme from '../../theme'
import { isSameDay, isToday } from 'date-fns'
import { gSpace, gStyles } from '../../styles'

const WeekTimeline = ({ numberOfDays = 7 }) => {
  const [date, setDate] = useState(new Date())
  const [weekStart, setWeekStart] = useState(new Date())
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  const handleSetWeek = (page) => {
    const newDate = new Date(date.setDate(date.getDate() + page * numberOfDays))
    setWeekStart(newDate)
  }

  const onPressSlot = (date, hour) => {
    console.log({ date, hour })
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
        weekStart={weekStart}
        numberOfDays={numberOfDays}
        onPressSlot={onPressSlot}
      />
    </View>
  )
}

const EventsView = ({ weekStart, numberOfDays, onPressSlot }) => {
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

  return (
    <View
      onLayout={onLayout}
      style={{ justifyContent: 'space-evenly', flexDirection: 'row', flex: 1 }}
    >
      {daysOfWeek.map((_date, i) => {
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
                  onPress={() => {
                    onPressSlot(_date, hours[i])
                  }}
                  width={width / numberOfDays - 10}
                  label={hours[i]}
                />
              )
            })}
          </View>
        )
      })}
    </View>
  )
}

const SlotCell = ({ width, label, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 50,
        width,
        justifyContent: 'flex-end',
        borderBottomColor: 'black',
        borderBottomWidth: 0.3
      }}
    >
      <Text style={gStyles.helper}>{label}</Text>
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
