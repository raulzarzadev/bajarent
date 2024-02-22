import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import InputTextStyled from './InputTextStyled'
import InputRadios from './InputRadios'
import Button from './Button'
import { PriceType, TimeType } from '../types/PriceType'

const FormPrice = ({
  handleSubmit
}: {
  handleSubmit: ({ amount, title, time }: Partial<PriceType>) => Promise<any>
}) => {
  const [units, setUnits] = useState<TimeType>('minute')
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSetUnits = (value) => {
    setUnits(value)
  }

  const onSubmit = async () => {
    setLoading(true)
    await handleSubmit({ title, time: `${quantity} ${units}`, amount: price })
    setLoading(false)
  }

  const unitOptions: { label: string; value: TimeType }[] = [
    { label: 'Minutos', value: 'minute' },
    { label: 'Horas', value: 'hour' },
    { label: 'Días', value: 'day' },
    { label: 'Semanas', value: 'week' },
    { label: 'Meses', value: 'month' }
  ]

  return (
    <View>
      <View style={styles.input}>
        <InputTextStyled onChangeText={setTitle} placeholder="Título" />
      </View>
      <View style={styles.input}>
        <InputTextStyled
          onChangeText={(qty) => {
            setQuantity(Number(qty))
          }}
          placeholder="Cantidad "
          type="number"
        />
      </View>
      <View style={styles.input}>
        <InputRadios
          layout="row"
          setValue={handleSetUnits}
          value={units}
          options={unitOptions}
        />
      </View>
      <View style={styles.input}>
        <InputTextStyled
          onChangeText={(price) => {
            setPrice(Number(price))
          }}
          placeholder=" $ Precio"
          type="number"
        />
      </View>

      <View>
        <Button disabled={loading} label="Agregar" onPress={onSubmit}></Button>
      </View>
    </View>
  )
}

export default FormPrice

const styles = StyleSheet.create({
  input: {
    marginVertical: 8
  }
})
