import React from 'react'
import { View } from 'react-native'
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Button from './Button'
import { dateFormat } from '../libs/utils-date'
import { set } from 'date-fns'

type PickerTime = { hours: number; minutes: number }

export default function InputDate({
  label = 'Fecha',
  value = new Date(),
  setValue,
  format = 'EEEE dd / MMM / yy',
  withTime = false
}: {
  label: string
  value: Date
  setValue: (value: Date) => void
  format?: string
  withTime?: boolean
}) {
  const nowDate = new Date()
  const [date, setDate] = React.useState(value)
  const [open, setOpen] = React.useState(false)
  const [time, setTime] = React.useState<PickerTime>({
    hours: nowDate.getHours(),
    minutes: nowDate.getMinutes()
  })
  const onDismissSingle = React.useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const handleSetDate = ({ date }) => {
    let newDate
    if (withTime) {
      newDate = new Date(date.setHours(time.hours, time.minutes, 0, 0))
    } else {
      newDate = new Date(date)
    }
    setDate(newDate)
    setValue(newDate)
    setOpen(false)
  }

  const handleSetTime = (time: PickerTime) => {
    const newDate = new Date(date.setHours(time.hours, time.minutes, 0, 0))
    setTime(time)
    setDate(newDate)
    setValue(newDate)
  }

  const hours = date.getHours()
  const minutes = date.getMinutes()
  return (
    <>
      <Button
        variant="outline"
        onPress={() => setOpen(true)}
        // uppercase={false}
        // mode="outlined"
      >
        {`${label} ${!!date && dateFormat(date, format)}`}
        {/* {date
          ? `Fecha de entrega : ${dateFormat(date, 'EEEE dd / MMM / yy')}`
          : 'Seleccionar fecha '} */}
      </Button>
      {withTime && (
        <TimePicker
          time={time || { hours, minutes }}
          setTime={(time) => {
            handleSetTime(time)
          }}
        />
      )}

      <SafeAreaProvider>
        <View
          style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}
        >
          <DatePickerModal
            locale="es"
            mode="single"
            visible={open}
            onDismiss={onDismissSingle}
            date={date}
            onConfirm={handleSetDate}
            saveLabel="Guardar" // optional
            label="Seleccionar fecha" // optional
          />
        </View>
      </SafeAreaProvider>
    </>
  )
}

const TimePicker = ({
  time,
  setTime
}: {
  time?: PickerTime
  setTime?: (time: PickerTime) => void
}) => {
  const [open, setOpen] = React.useState(false)
  const onDismiss = React.useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const onConfirm = React.useCallback(
    ({ hours, minutes }) => {
      setOpen(false)
      setTime({ hours, minutes })
    },
    [setOpen, time]
  )

  return (
    <>
      <Button
        buttonStyles={{ marginTop: 6 }}
        label={time ? `Hora ${time.hours}:${time.minutes}` : 'Seleccionar hora'}
        variant="outline"
        onPress={() => {
          setOpen(true)
        }}
      ></Button>
      <SafeAreaProvider>
        <TimePickerModal
          visible={open}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          hours={time?.hours || 12}
          minutes={time?.minutes || 14}
        />
      </SafeAreaProvider>
    </>
  )
}
