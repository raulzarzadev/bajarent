import { useCallback, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import asDate, { dateFormat } from '../libs/utils-date'
import Button, { type ButtonProps } from './Button'
import ErrorBoundary from './ErrorBoundary'
import type { IconName } from './Icon'
export type InputDateProps = {
  label?: string
  icon?: IconName
  value: Date | null
  setValue: (value: Date) => void
  format?: string
  withTime?: boolean
  size?: ButtonProps['size']
  openButtonProps?: Partial<ButtonProps>
  disabled?: boolean
}
type PickerTime = { hours: number; minutes: number }
const DEFAULT_PICKER_TIME: PickerTime = { hours: 0, minutes: 0 }

const getPickerTimeFromDate = (currentDate?: Date | null): PickerTime => ({
  hours: currentDate?.getHours() ?? DEFAULT_PICKER_TIME.hours,
  minutes: currentDate?.getMinutes() ?? DEFAULT_PICKER_TIME.minutes
})
export default function InputDate({
  label = '',
  value,
  setValue,
  format = 'EE dd / MMM / yy',
  withTime = false,
  icon = 'calendar',
  size,
  openButtonProps,
  disabled
}: InputDateProps) {
  const [open, setOpen] = useState(false)
  const initialDate = value ? asDate(value) : null
  const [date, setDate] = useState<Date | null>(initialDate)
  const [time, setTime] = useState<PickerTime>(
    getPickerTimeFromDate(initialDate)
  )
  const externalValueRef = useRef<number | null>(initialDate?.getTime() ?? null)

  const onDismissSingle = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  useEffect(() => {
    const normalizedValue = value ? asDate(value) : null
    const nextTimestamp = normalizedValue?.getTime() ?? null

    if (externalValueRef.current === nextTimestamp) return

    externalValueRef.current = nextTimestamp
    setDate(normalizedValue)
    setTime(getPickerTimeFromDate(normalizedValue))
  }, [value])

  const handleSetDate = ({ date: selectedDate }) => {
    if (!selectedDate) return
    const nextDate = new Date(selectedDate)
    nextDate.setHours(time.hours, time.minutes, 0, 0)
    setDate(nextDate)
    setOpen(false)
    externalValueRef.current = nextDate.getTime()
    setValue(nextDate)
  }

  const handleSetTime = (selectedTime: PickerTime) => {
    const baseDate = date ? new Date(date) : new Date()
    baseDate.setHours(selectedTime.hours, selectedTime.minutes, 0, 0)
    setTime(selectedTime)
    setDate(baseDate)
    setOpen(false)
    externalValueRef.current = baseDate.getTime()
    setValue(baseDate)
  }

  return (
    <View>
      <Button
        variant="outline"
        onPress={() => setOpen(true)}
        icon={icon}
        size={size}
        {...openButtonProps}
        disabled={disabled}
        fullWidth
      >
        {`${label} ${date ? dateFormat(date, format) : ''}`}
      </Button>
      {withTime && (
        <TimePicker time={time} setTime={handleSetTime} disabled={disabled} />
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
            saveLabel="Guardar"
            label="Seleccionar fecha"
            presentationStyle="pageSheet"
            startYear={2020}
            endYear={2030}
          />
        </View>
      </SafeAreaProvider>
    </View>
  )
}

export const InputDateE = (props: InputDateProps) => (
  <ErrorBoundary componentName="InputDate">
    <InputDate {...props} />
  </ErrorBoundary>
)

const TimePicker = ({ time, setTime, disabled }: TimePickerProps) => {
  const [open, setOpen] = useState(false)
  const onDismiss = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const onConfirm = useCallback(
    ({ hours, minutes }) => {
      setOpen(false)
      setTime?.({ hours, minutes })
    },
    [setOpen, setTime]
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
        disabled={disabled}
      ></Button>
      <SafeAreaProvider>
        <TimePickerModal
          visible={open}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          hours={time?.hours || 12}
          minutes={time?.minutes || 14}
          cancelLabel="Cancelar"
          confirmLabel="Confirmar"
          use24HourClock
          label="Seleccionar hora"
          animationType="fade"
        />
      </SafeAreaProvider>
    </>
  )
}
export type TimePickerProps = {
  time?: PickerTime
  setTime?: (time: PickerTime) => void
  disabled?: boolean
}
export const TimePickerE = (props: TimePickerProps) => (
  <ErrorBoundary componentName="TimePicker">
    <TimePicker {...props} />
  </ErrorBoundary>
)
