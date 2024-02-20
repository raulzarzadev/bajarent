import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Formik } from 'formik'
import Button from './Button'
import InputDate from './InputDate'
import { gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import theme from '../theme'
import InputRadios from './InputRadios'
import { BalanceType } from '../types/BalanceType'

const FormBalance = ({
  defaultValues,
  onSubmit = async (values) => {
    console.log(values)
  }
}: {
  defaultValues?: Partial<BalanceType>
  onSubmit?: (values: Partial<BalanceType>) => Promise<any>
}) => {
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
    fromDate: new Date(new Date().setHours(8, 0, 0, 0)),
    toDate: new Date(),
    userId: ''
  }

  return (
    <Formik
      initialValues={{ ...defaultBalanceValues, ...defaultValues }}
      onSubmit={async (values) => {
        handleSubmit(values)
      }}
    >
      {({ handleSubmit, setValues, values }) => (
        <View style={gStyles.container}>
          {/* SELECT BALANCE TYPE , PARTIAL OR FULL. FULL ARE DEFAULT SELECTED */}
          <View style={[styles.input]}>
            <SelectBalanceType
              balanceType={{
                type: values.type,
                userId: values.userId
              }}
              setBalanceType={(balance) =>
                setValues((prev) => ({ ...prev, ...balance }))
              }
            />
          </View>
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
          {/* <View style={styles.input}>
            <FormikInputValue name={'name'} placeholder="Nombre" />
          </View>
          <View style={styles.input}>
            <FormikInputValue name={'description'} placeholder="Descripción" />
          </View> */}
          <View
            style={[
              styles.input,
              { flexDirection: 'row', justifyContent: 'space-around' }
            ]}
          >
            <Button
              variant="ghost"
              onPress={() => setValues({ ...defaultBalanceValues })}
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
const SelectBalanceType = ({
  setBalanceType,
  balanceType
}: {
  setBalanceType: (balanceUser: BalanceUser) => void
  balanceType: BalanceUser
}) => {
  const { staff } = useStore()
  const [type, setType] = React.useState('')
  const [userSelected, setUserSelected] = React.useState<string | null>('')
  useEffect(() => {
    setType(balanceType.type)
    setUserSelected(balanceType.userId)
  }, [balanceType])

  const modal = useModal({ title: 'Seleccionar usuario' })
  // @ts-ignore
  const users = Object.groupBy(staff, (user) => user.userId)
  const usersData = Object.keys(users).map((userId) => {
    const userData = staff.find((user) => user.userId === userId)
    return {
      userId,
      positions: users[userId],
      ...userData
    }
  })

  const handleSelectUser = (userId: string) => {
    setUserSelected(userId)
    setBalanceType({ type: 'partial', userId })
    modal.toggleOpen()
  }

  const handleSetType = (value: BalanceType['type']) => {
    if (value === 'full') {
      setBalanceType({ type: 'full', userId: '' })
      setUserSelected(null)
      setType(value)
    } else {
      setBalanceType({ type: 'partial', userId: userSelected })
      setUserSelected('')
      setType(value)
    }
  }

  const userName = usersData.find((user) => user.userId === userSelected)?.name

  return (
    <View>
      <View
        style={{
          marginVertical: 8,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-evenly'
        }}
      >
        <InputRadios
          label="Tipo de balance"
          options={[
            { label: 'Total', value: 'full' },
            { label: 'Partial', value: 'partial' }
          ]}
          layout="row"
          setValue={(value: BalanceType['type']) => handleSetType(value)}
          value={type}
        />
        {type === 'partial' && (
          <View>
            <Button
              size="small"
              label={`${userSelected ? userName : 'Seleccionar usuario'}`}
              onPress={modal.toggleOpen}
            ></Button>
          </View>
        )}
      </View>
      <StyledModal {...modal}>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ width: 120 }}>Usuiario</Text>
            <Text>Posisiones </Text>
          </View>
          {usersData.map((user) => (
            <Pressable
              onPress={() => handleSelectUser(user.userId)}
              key={user.id}
              style={{
                flexDirection: 'row',
                marginVertical: 8,
                padding: 4,
                backgroundColor: theme.info,
                borderWidth: 2,
                borderColor:
                  user.id === userSelected ? theme.secondary : 'transparent',
                borderRadius: 4
              }}
            >
              <Text style={{ width: 120 }}>{user.name} </Text>
              <View style={{ flexDirection: 'row' }}>
                {user.positions.map((p) => (
                  <Text key={p.id}>{`${p.position} `}</Text>
                ))}
              </View>
            </Pressable>
          ))}
        </View>
      </StyledModal>
    </View>
  )
}

export default FormBalance

const styles = StyleSheet.create({
  input: {
    marginVertical: 4
  }
})
