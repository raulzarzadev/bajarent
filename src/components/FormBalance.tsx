import { StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import { Formik } from 'formik'
import Button from './Button'
import InputDate from './InputDate'
import { gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'
import { BalanceType } from '../types/BalanceType'
import ErrorBoundary from './ErrorBoundary'
import InputSelect from './InputSelect'
import TextInfo from './TextInfo'
import Icon from './Icon'

export type FormBalanceProps = {
  defaultValues?: Partial<BalanceType>
  onSubmit?: (values: Partial<BalanceType>) => Promise<any>
  handleClear?: () => void
}
const FormBalanceE = ({
  handleClear,
  defaultValues,
  onSubmit = async (values) => {
    console.log(values)
  }
}: FormBalanceProps) => {
  const [submitting, setSubmitting] = React.useState(false)
  const handleSubmit = async (values: Partial<BalanceType>) => {
    setSubmitting(true)
    return await onSubmit(values)
      .then(console.log)
      .catch(() => {
        setSubmitting(false)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const defaultBalanceValues: Partial<BalanceType> = {
    type: 'full',
    fromDate: new Date(new Date().setHours(7, 0, 0, 0)),
    toDate: new Date(new Date().setHours(19, 0, 0, 0)),
    userId: ''
  }
  const initialValues = { ...defaultBalanceValues, ...defaultValues }
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        handleSubmit(values)
      }}
    >
      {({ handleSubmit, setValues, values }) => (
        <View style={gStyles.container}>
          {/* SELECT BALANCE TYPE , PARTIAL OR FULL. FULL ARE DEFAULT SELECTED */}
          <View style={[styles.input]}>
            <SelectBalanceType2
              balanceType={{
                type: values.type,
                userId: values.userId
              }}
              setBalanceType={(balance) => {
                setValues((values) => ({ ...values, ...balance }), false)
              }}
            />
          </View>
          <TextInfo
            type="info"
            text="Selecciona las fechas entre las que deseas calcular el balance. "
          />
          <View style={[styles.input]}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-around' }}
            >
              {/* SELECT PERIOD OF TIME */}
              <View style={{ justifyContent: 'center' }}>
                <InputDate
                  format="E dd/MMM"
                  withTime
                  label="Desde "
                  value={values.fromDate}
                  setValue={(value) =>
                    setValues(
                      (values) => ({ ...values, fromDate: value }),
                      false
                    )
                  }
                />
              </View>
              <View style={{ alignSelf: 'center' }}>
                <Icon icon="rowRight" />
              </View>
              <View style={{ justifyContent: 'center' }}>
                <InputDate
                  withTime
                  format="E dd/MMM"
                  label="Hasta "
                  value={values.toDate}
                  setValue={(value) =>
                    setValues((values) => ({ ...values, toDate: value }), false)
                  }
                />
              </View>
            </View>
          </View>

          <View
            style={[
              styles.input,
              { flexDirection: 'row', justifyContent: 'space-around' }
            ]}
          >
            <Button
              variant="ghost"
              onPress={() => {
                setValues({ ...defaultBalanceValues })
                handleClear?.()
              }}
              label={'Limpiar'}
            />
            <Button
              disabled={submitting}
              onPress={handleSubmit}
              label={'Calcular'}
            />
          </View>
        </View>
      )}
    </Formik>
  )
}
type BalanceUser = {
  type: BalanceType['type']
  userId: string
}

const SelectBalanceType2 = ({
  setBalanceType,
  balanceType
}: {
  setBalanceType: (balanceUser: BalanceUser) => void
  balanceType: BalanceUser
}) => {
  const { staff } = useStore()
  const options = useMemo(() => {
    return [
      { label: 'Completo', value: 'full' },
      ...staff.map((user) => ({ label: user.name, value: user.userId }))
    ]
  }, [staff])

  return (
    <View>
      <Text style={gStyles.h2}>Tipo de balance</Text>
      <Text style={[gStyles.helper, gStyles.tCenter]}> </Text>

      <TextInfo
        type="info"
        text=" Puedes escoger entre hacer un balance general o seleccionar una persona
        del staff"
      />

      <InputSelect
        value={balanceType.type === 'full' ? 'full' : balanceType.userId}
        options={options}
        onChangeValue={(value) => {
          if (value === 'full') {
            return setBalanceType({ type: 'full', userId: '' })
          } else {
            setBalanceType({ type: 'partial', userId: value })
          }
        }}
      />
    </View>
  )
}

export default function FormBalance(props: FormBalanceProps) {
  return (
    <ErrorBoundary componentName="FormBalance">
      <FormBalanceE {...props} />
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  input: {
    marginVertical: 4
  }
})
