import React from 'react'
import { View } from 'react-native'
import { DatePickerModal } from 'react-native-paper-dates'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Button from './Button'
import { dateFormat } from '../libs/utils-date'

export default function InputDate({
  value,
  setValue
}: {
  value: Date
  setValue: (value: Date) => void
}) {
  const [date, setDate] = React.useState(value)
  const [open, setOpen] = React.useState(false)

  const onDismissSingle = React.useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const onConfirmSingle = React.useCallback(
    (params) => {
      setDate(params.date)
      setOpen(false)
      setValue(params.date)
    },
    [setOpen, setDate]
  )

  return (
    <>
      <Button
        variant="outline"
        onPress={() => setOpen(true)}
        // uppercase={false}
        // mode="outlined"
      >
        {date
          ? `Fecha de entrega : ${dateFormat(date, 'EEEE dd / MMM / yy')}`
          : 'Seleccionar fecha '}
      </Button>
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
            onConfirm={onConfirmSingle}
            saveLabel="Guardar" // optional
            label="Seleccionar fecha" // optional
          />
        </View>
      </SafeAreaProvider>
    </>
  )
}
