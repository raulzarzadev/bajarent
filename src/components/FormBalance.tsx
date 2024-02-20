import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import Button from './Button'
import StoreType from '../types/StoreType'
import InputDate from './InputDate'
import { gStyles } from '../styles'

import ModalSelectStaff from './ModalSelectStaff'
import { useStore } from '../contexts/storeContext'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'

const FormBalance = ({
  defaultValues,
  onSubmit = async (values) => {
    console.log(values)
  }
}: {
  defaultValues?: Partial<StoreType>
  onSubmit?: (values: Partial<StoreType>) => Promise<any>
}) => {
  const [submitting, setSubmitting] = React.useState(false)
  const handleSubmit = async (values: Partial<StoreType>) => {
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
  return (
    <Formik
      initialValues={{ ...defaultValues }}
      onSubmit={async (values) => {
        handleSubmit(values)
      }}
    >
      {({ handleSubmit, setValues }) => (
        <View style={gStyles.container}>
          {/* SELECT BALANCE TYPE , PARTIAL OR FULL. FULL ARE DEFAULT SELECTED */}
          <View style={[styles.input]}>
            <SelectBalanceType />
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
                  value={new Date()}
                  setValue={(value) =>
                    setValues(
                      (values) => ({ ...values, scheduledAt: value }),
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
                  value={new Date()}
                  setValue={(value) =>
                    setValues(
                      (values) => ({ ...values, scheduledAt: value }),
                      false
                    )
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
          <View style={styles.input}>
            <Button
              disabled={submitting}
              onPress={handleSubmit}
              label={'Guardar'}
            />
          </View>
        </View>
      )}
    </Formik>
  )
}

const SelectBalanceType = () => {
  const { staff } = useStore()
  const [userSelected, setUserSelected] = React.useState<string | null>(null)
  const modal = useModal({ title: 'Seleccionar usuario' })
  const callback = (user) => user.userId
  const users = Object.groupBy(staff, callback)

  return (
    <View>
      <Button label="Tipo" onPress={modal.toggleOpen}></Button>
      <StyledModal {...modal}>
        <View></View>
      </StyledModal>
      {/* <ModalSelectStaff
        onPress={(staffId) => {
          setUserSelected(staffId)
          console.log({ staffId })
        }}
        staff={staff}
        staffSelected={[userSelected]}
      /> */}
    </View>
  )
}

export default FormBalance

const styles = StyleSheet.create({
  input: {
    marginVertical: 10
  }
})
