import React, { useEffect } from 'react'
import { View } from 'react-native'
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Button, { ButtonProps } from './Button'
import asDate, { dateFormat } from '../libs/utils-date'
import { IconName } from './Icon'

type PickerTime = { hours: number; minutes: number }
export default function InputDate({
  label = '',
  value = new Date(),
  setValue,
  format = 'EE dd / MMM / yy',
  withTime = false,
  icon = 'calendar',
  size,
  openButtonProps
}: {
  label?: string
  icon?: IconName
  value: Date
  setValue: (value: Date) => void
  format?: string
  withTime?: boolean
  size?: ButtonProps['size']
  openButtonProps?: Partial<ButtonProps>
}) {
  const nowDate = new Date()

  const [open, setOpen] = React.useState(false)

  const [date, setDate] = React.useState(value || nowDate)

  const defaultTime = withTime
    ? {
        hours: date?.getHours(),
        minutes: date?.getMinutes()
      }
    : {
        hours: 0,
        minutes: 0
      }

  const [time, setTime] = React.useState<PickerTime>(defaultTime)

  const onDismissSingle = React.useCallback(() => {
    setOpen(false)
  }, [setOpen])

  useEffect(() => {
    setDate(asDate(value))
  }, [value])

  const handleSetDate = ({ date }) => {
    setDate(date)
    setOpen(false)
    setValue(new Date(date.setHours(time.hours, time.minutes, 0, 0)))
  }

  const handleSetTime = (time: PickerTime) => {
    setTime(time)
    setOpen(false)
    setValue(new Date(date.setHours(time.hours, time.minutes, 0, 0)))
  }

  const hours = date?.getHours()
  const minutes = date?.getMinutes()
  return (
    <>
      <Button
        variant="outline"
        onPress={() => setOpen(true)}
        icon={icon}
        size={size}
        {...openButtonProps}
      >
        {`${label} ${!!date ? dateFormat(date, format) : ''}`}
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
