import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import InputTextStyled from './InputTextStyled'
import InputRadios from './InputRadios'
import Button from './Button'
import { PriceType, TimeType } from '../types/PriceType'

const FormPrice = ({
  defaultPrice,
  handleSubmit
}: {
  defaultPrice: Partial<PriceType>
  handleSubmit: ({ amount, title, time }: Partial<PriceType>) => Promise<any>
}) => {
  const [units, setUnits] = useState<TimeType>('minute')
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (defaultPrice) {
      const [qty, unit] = defaultPrice.time.split(' ')
      setUnits(unit as TimeType)
      setQuantity(parseFloat(qty))
      setPrice(defaultPrice.amount)
      setTitle(defaultPrice.title)
    }
  }, [defaultPrice])

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
        <InputTextStyled
          value={title}
          onChangeText={setTitle}
          placeholder="Título"
        />
      </View>
      <View style={styles.input}>
        <InputTextStyled
          value={quantity.toString()}
          onChangeText={(qty) => {
            setQuantity(Number(qty))
          }}
          placeholder="Cantidad "
          type="number"
          helperText='Cantidad de "Minutos, Horas, Días, Semanas, Meses"'
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
          value={price.toString()}
          onChangeText={(price) => {
            setPrice(Number(price))
          }}
          placeholder=" $ Precio"
          type="number"
          helperText="$ Precio por totalidad del tiempo"
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
