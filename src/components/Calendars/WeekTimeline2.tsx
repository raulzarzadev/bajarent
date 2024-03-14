import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from '../Button'
import theme from '../../theme'
import { getWeek, isSameDay, isToday } from 'date-fns'

const WeekTimeline = () => {
  const [date, setDate] = useState(new Date())
  const [week, setWeek] = useState(getWeek(date))
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  const handleSetWeek = (week) => {
    setWeek(week)
    const newDate = new Date()
    newDate.setDate(newDate.getDate() + week * 7)
    setDate(newDate)
  }
  return (
    <View>
      <Text style={{ textAlign: 'center' }}>
        {month} {year}
      </Text>
      {!isToday(date) && (
        <Button
          label="hoy"
          onPress={() => {
            setDate(new Date())
          }}
          size="xs"
          variant="ghost"
        ></Button>
      )}
      <View style={{ flexDirection: 'row' }}>
        {/* back week  */}
        <Button
          size="xs"
          onPress={() => {
            handleSetWeek(week - 1)
          }}
          justIcon
          variant="ghost"
          icon="rowLeft"
        ></Button>
        {/* WEEK VIEW */}
        <WeekView
          date={date}
          onChangeDate={(date) => {
            setDate(date)
          }}
        />
        {/* next week */}
        <Button
          size="xs"
          onPress={() => {
            handleSetWeek(week + 1)
          }}
          justIcon
          variant="ghost"
          icon="rowRight"
        ></Button>
      </View>
    </View>
  )
}

const WeekView = ({ date, onChangeDate }) => {
  const [daysOfWeek, setDaysOfWeek] = useState([])

  useEffect(() => {
    setDaysOfWeek(
      Array.from({ length: 7 }, (_, i) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + i)
      })
    )
  }, [date])

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
