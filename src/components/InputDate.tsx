import React, { useEffect } from 'react'
import { View } from 'react-native'
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Button from './Button'
import { dateFormat } from '../libs/utils-date'

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
  const [open, setOpen] = React.useState(false)

  const [date, setDate] = React.useState(value)
  const [time, setTime] = React.useState<PickerTime>({
    hours: nowDate.getHours(),
    minutes: nowDate.getMinutes()
  })

  const onDismissSingle = React.useCallback(() => {
    setOpen(false)
  }, [setOpen])

  useEffect(() => {
    setValue(new Date(date.setHours(time.hours, time.minutes, 0, 0)))
  }, [date, time])

  const handleSetDate = ({ date }) => {
    setDate(date)
    setOpen(false)
  }

  const handleSetTime = (time: PickerTime) => {
    setTime(time)
    setOpen(false)
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

  const numberToTime = (number: number) => {
    return number < 10 ? `0${number}` : number
  }

  return (
    <>
      <Button
        buttonStyles={{ marginTop: 6 }}
        label={
          time
            ? `Hora ${numberToTime(time.hours)}:${numberToTime(time.minutes)}`
            : 'Seleccionar hora'
        }
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
