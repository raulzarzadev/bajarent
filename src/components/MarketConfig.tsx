import { FieldArray, Formik } from 'formik'
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import type StoreType from '../types/StoreType'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'
import theme from '../theme'
import FormikCheckbox from './FormikCheckbox'
import FormikInputSelect from './FormikInputSelect'

import FormikInputValue from './FormikInputValue'
import { gSpace, gStyles } from '../styles'
import { ServiceStores } from '../firebase/ServiceStore'
import catchError from '../libs/catchError'
import { createId2 } from '../libs/createId'
import { states_of_mexico } from '../../CONSTANTES/states_of_mexico'

export const MarketConfig = (props: MarketConfigProps) => {
  const { shop } = props
  const [sending, setSending] = useState(false)

  const initialValues = {
    marketVisible: shop?.marketVisible || false,
    serviceAreas: shop?.marketConfig?.serviceAreas || []
  }

  const handleSubmitMarketConfig = async (values) => {
    // Aquí puedes manejar el envío de la configuración del mercado
    // Por ejemplo, actualizar la tienda en la base de datos
    console.log('Configuración del mercado enviada:', values)
    const [err, res] = await catchError(
      ServiceStores.update(shop.id, {
        marketVisible: values.marketVisible,
        marketConfig: {
          serviceAreas: values.serviceAreas
        }
      })
    )
    if (err) {
      console.error('Error al actualizar la configuración del mercado:', err)
    } else {
      console.log('Configuración del mercado actualizada con éxito:', res)
    }
  }

  const STATE_OPTIONS = Object.keys(states_of_mexico).map((state) => ({
    label: state,
    value: state
  }))
  const MUNICIPALITIES_BY_STATE = Object.fromEntries(
    Object.entries(states_of_mexico).map(([state, municipalities]) => [
      state,
      municipalities.map((municipality) => ({
        label: municipality,
        value: municipality
      }))
    ])
  )

  return (
    <View style={gStyles.container}>
      <Text style={gStyles.h2}>Configuración de Mercado</Text>
      <Text style={[gStyles.helper, { marginBottom: gSpace(3) }]}>
        Personaliza cómo se verá tu tienda en el mercado público
      </Text>

      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          setSending(true)
          try {
            await handleSubmitMarketConfig?.(values)
          } catch (error) {
            console.error('Error al guardar configuración:', error)
          } finally {
            setSending(false)
          }
        }}
      >
        {({ handleSubmit, values }) => (
          <View style={styles.form}>
            <View style={styles.section}>
              <FormikCheckbox
                name="marketVisible"
                label="Mostrar tienda en el mercado público"
              />
            </View>

            {values.marketVisible && (
              <View style={styles.section}>
                <Text style={[gStyles.h2, { marginBottom: gSpace(1) }]}>
                  Áreas de servicio
                </Text>
                <Text style={[{ marginBottom: gSpace(2) }]}>
                  * Cada área de servicio puede incluir estado, municipio,
                  colonia y notas para hacer referencias a particularidades
                  dentro de cada area.
                </Text>
                <Text style={[{ marginBottom: gSpace(2) }]}>
                  * Ejemplo: Estado: Baja California, Municipio: Tijuana,
                  Colonia: Centro y Norte hasta Chametla , Notas: Solo fines de
                  semana.
                </Text>
                <Text style={[{ marginBottom: gSpace(2) }]}>
                  * Recuerda que las personas rara vez buscan por áreas muy
                  específicas, así que no es necesario agregar demasiadas áreas
                  detalladas. Con 1 o 2 áreas generales suele ser suficiente
                  pero esto debe ajustarse a las necesidades de tu negocio y
                  operación.
                </Text>
                <FieldArray
                  name="serviceAreas"
                  render={(arrayHelpers) => {
                    const serviceAreas = values.serviceAreas || []
                    return (
                      <View>
                        {serviceAreas.map((area, index) => {
                          const stateOptions = STATE_OPTIONS
                          const municipalityOptions =
                            MUNICIPALITIES_BY_STATE[area.state] || []
                          return (
                            <View key={area.id} style={styles.areaCard}>
                              <Text style={styles.areaLabel}>
                                Área {index + 1}
                              </Text>
                              <FormikInputSelect
                                name={`serviceAreas.${index}.state`}
                                placeholder="Estado"
                                options={stateOptions}
                                containerStyle={{ marginBottom: gSpace(1) }}
                              />
                              <FormikInputSelect
                                name={`serviceAreas.${index}.municipality`}
                                placeholder="Municipio"
                                options={municipalityOptions}
                                containerStyle={{ marginBottom: gSpace(1) }}
                              />
                              <FormikInputValue
                                name={`serviceAreas.${index}.neighborhood`}
                                placeholder="Colonia (s) "
                                containerStyle={{ marginBottom: gSpace(1) }}
                                helperText="Puede especificar varias colonias separadas por comas o areas populares"
                              />
                              <FormikInputValue
                                name={`serviceAreas.${index}.notes`}
                                placeholder="Notas"
                                containerStyle={{ marginBottom: gSpace(1) }}
                                multiline
                                numberOfLines={2}
                              />
                              <Button
                                onPress={() => arrayHelpers.remove(index)}
                                label="Eliminar"
                                variant="outline"
                                size="small"
                                buttonStyles={{ marginTop: gSpace(1) }}
                              />
                            </View>
                          )
                        })}
                        <Button
                          onPress={() =>
                            arrayHelpers.push({
                              country: '',
                              state: '',
                              municipality: '',
                              neighborhood: '',
                              notes: '',
                              id: createId2()
                            })
                          }
                          label="Agregar área"
                          icon="add"
                          variant="ghost"
                          buttonStyles={{
                            marginTop: gSpace(1),
                            alignSelf: 'flex-end'
                          }}
                        />
                      </View>
                    )
                  }}
                />
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Button
                onPress={handleSubmit}
                label="Guardar configuración"
                disabled={sending}
                buttonStyles={{ alignSelf: 'center' }}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  )
}

export type MarketConfigProps = {
  shop?: StoreType
}

export const MarketConfigE = (props: MarketConfigProps) => (
  <ErrorBoundary componentName="MarketConfig">
    <MarketConfig {...props} />
  </ErrorBoundary>
)

const styles = StyleSheet.create({
  form: {
    width: '100%'
  },
  section: {
    marginBottom: gSpace(3)
  },
  buttonContainer: {
    marginTop: gSpace(4),
    alignItems: 'center'
  },
  areaCard: {
    marginBottom: gSpace(2),
    padding: gSpace(2),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.neutral,
    backgroundColor: theme.white
  },
  areaLabel: {
    fontWeight: 'bold',
    marginBottom: gSpace(1)
  }
})
