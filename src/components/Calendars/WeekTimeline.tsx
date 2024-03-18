import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button from '../Button'

const WeekTimeline = () => {
  const date = new Date()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  const firstDayOfWeek = date

  firstDayOfWeek.setDate(
    date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1)
  )

  // Genera un array de los días de la semana
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(firstDayOfWeek)
    day.setDate(firstDayOfWeek.getDate() + i)
    return day.getDate() // devuelve el día del mes
  })

  return (
    <View>
      <Text style={{ textAlign: 'center' }}>
        {month} {year}
      </Text>
      <View style={{ flexDirection: 'row' }}>
        {/* back week  */}
        <Button
          size="xs"
          onPress={() => {
            console.log('add')
          }}
          justIcon
          variant="ghost"
          icon="rowLeft"
        ></Button>
        {/* week days */}
        <View style={{ width: '80%' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly'
            }}
          >
            {WeekDays.map((day, index) => {
              return (
                <View key={index}>
                  <Text>{day.substring(0, 3)}</Text>
                </View>
              )
            })}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly'
            }}
          >
            {daysOfWeek.map((day) => (
              <View key={day}>
                <Text>{day}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* next week */}
        <Button
          size="xs"
          onPress={() => {
            console.log('add')
          }}
          justIcon
          variant="ghost"
          icon="rowRight"
        ></Button>
      </View>
    </View>
  )
}

export default WeekTimeline

const styles = StyleSheet.create({})

const WeekDays = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
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
