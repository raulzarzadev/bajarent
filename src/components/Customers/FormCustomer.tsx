import { View, Text, StyleSheet, Dimensions } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { Formik, useFormik, useFormikContext } from 'formik'
import Button from '../Button'
import { CustomerType } from '../../app/features/costumers/customerType'
import FormikInputValue from '../FormikInputValue'
import FormikInputSelect from '../FormikInputSelect'
import { gStyles } from '../../styles'
import { FormikInputPhoneE } from '../FormikInputPhone'
const FormCustomer = (props?: FormCustomerProps) => {
  const defaultCustomer: Partial<CustomerType> = {
    name: '',
    ...(props.defaultValues || {})
  }

  return (
    <View>
      <Formik
        initialValues={defaultCustomer}
        onSubmit={(values, actions) => {
          if (props?.onSubmit) {
            props.onSubmit(values)
          }
        }}
      >
        {({ handleSubmit }) => {
          return (
            <View>
              <View style={styles.input}>
                <FormikInputValue name="name" label="Nombre" />
              </View>
              <Text style={gStyles.h3}>Dirección</Text>
              <View style={styles.input}>
                <FormikInputValue name="address.neighborhood" label="Colonia" />
              </View>
              <View style={styles.input}>
                <FormikInputValue name="address.street" label="Calle" />
              </View>
              <View style={styles.input}>
                <FormikInputValue
                  name="address.references"
                  label="Referencias"
                />
              </View>
              <View style={styles.input}>
                <FormikInputValue
                  name="address.locationURL"
                  label="Ubicación (URL)"
                />
              </View>

              <FormikCustomerContacts />

              <Button onPress={handleSubmit} label="Guardar" />
            </View>
          )
        }}
      </Formik>
    </View>
  )
}
const FormikCustomerContacts = () => {
  const { values, setValues } = useFormikContext<Partial<CustomerType>>()

  const isMobile = Dimensions.get('window').width <= 768

  const layoutStyle = isMobile
    ? { marginBottom: 4 }
    : { marginRight: 2, maxWidth: 100 }

  return (
    <View>
      <Text style={gStyles.h3}>Contactos</Text>
      {Object.entries(values.contacts || {}).map(([key, value]) => (
        <View
          key={key}
          style={[
            styles.input,
            { marginBottom: 8, flexDirection: isMobile ? 'column' : 'row' }
          ]}
        >
          <FormikInputValue
            name={`contacts.${key}.label`}
            placeholder="Nombre"
            style={{ ...layoutStyle }}
          />
          <FormikInputSelect
            name={`contacts.${key}.type`}
            placeholder="Tipo"
            containerStyle={{ ...layoutStyle }}
            options={[
              {
                label: 'Teléfono',
                value: 'phone'
              },
              {
                label: 'Correo',
                value: 'email'
              }
            ]}
          />
          {values.contacts[key].type === 'phone' && (
            <FormikInputPhoneE name={`contacts.${key}.value`} />
          )}
          {values.contacts[key].type === 'email' && (
            <FormikInputValue
              containerStyle={{ flex: 1 }}
              placeholder="Correo"
              name={`contacts.${key}.value`}
            />
          )}
        </View>
      ))}
      <Button
        onPress={() => {
          const length = Object.keys(values.contacts || {}).length + 1
          setValues({
            ...values,
            contacts: {
              ...values.contacts,
              [length]: {
                label: '',
                type: '',
                value: '',
                id: `${length}`
              }
            }
          })
        }}
        icon="add"
        variant="ghost"
        label="Agregar contacto"
        size="xs"
        buttonStyles={{ marginBottom: 8 }}
      ></Button>
    </View>
  )
}
export default FormCustomer
export type FormCustomerProps = {
  onSubmit?: (values: Partial<CustomerType>) => void
  defaultValues?: Partial<CustomerType>
}
export const FormCustomerE = (props: FormCustomerProps) => (
  <ErrorBoundary componentName="FormCustomer">
    <FormCustomer {...props} />
  </ErrorBoundary>
)

const styles = StyleSheet.create({
  input: {
    marginVertical: 8
  }
})
