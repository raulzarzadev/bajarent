import { View, Text, StyleSheet } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import theme from '../theme'
import FormikCheckbox from './FormikCheckbox'
import { gStyles } from '../styles'
import { Formik } from 'formik'
import FormikInputValue from './FormikInputValue'
import StoreType, { bot_configs } from '../types/StoreType'
import Button from './Button'
const FormChatbotAutoWs = (props?: FormChatbotProps) => {
  const defaultValues: StoreType['chatbot'] = props.values

  console.log({ defaultValues })
  return (
    <View>
      <Formik
        initialValues={defaultValues}
        onSubmit={(values) => {
          if (props.onSubmit) return props.onSubmit(values)
        }}
      >
        {({ values, handleSubmit, isSubmitting }) => (
          <View
            style={{
              padding: 4,
              backgroundColor: theme.white,
              borderRadius: 8
            }}
          >
            <Text style={gStyles.h3}>Chatbot</Text>
            <FormikCheckbox
              name="enabledAutoWs"
              label="Activar chatbot"
            ></FormikCheckbox>
            {values?.enabledAutoWs && (
              <>
                <View style={styles.input}>
                  <FormikInputValue name="autoWsId" label="Bot Id" />
                </View>
                <View style={styles.input}>
                  <FormikInputValue name="autoWsApiKey" label="Api Key" />
                </View>
                <View style={styles.input}>
                  <FormikInputValue
                    name="hostNumber"
                    label="Numero anfitrión"
                  />
                </View>
              </>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginVertical: 16
              }}
            >
              <Button
                size="xs"
                label="Actualizar"
                onPress={handleSubmit}
                disabled={isSubmitting}
              ></Button>
            </View>
          </View>
        )}
      </Formik>
    </View>
  )
}
export default FormChatbotAutoWs
export type FormChatbotProps = {
  values?: StoreType['chatbot']
  onSubmit?: (values: StoreType['chatbot']) => Promise<any>
}
export const FormChatbotE = (props: FormChatbotProps) => (
  <ErrorBoundary componentName="FormChatbotAutoWs">
    <FormChatbotAutoWs {...props} />
  </ErrorBoundary>
)
const styles = StyleSheet.create({
  input: {
    marginVertical: 10
  },
  type: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: 4
  }
})
