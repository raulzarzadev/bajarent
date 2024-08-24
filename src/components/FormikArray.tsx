import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { Formik, Form, Field, FieldArray } from 'formik'
import Button from './Button'
import FormikInputValue from './FormikInputValue'
import FormikInputSelect from './FormikInputSelect'
import { gStyles } from '../styles'
import { FormikInputPhoneE } from './FormikInputPhone'
import { FormikFieldArrayE } from './FormikInputArray'

const FormikArray = ({ name }: { name: string }) => (
  <div>
    <h1>Friend List</h1>
    <Formik
      initialValues={{
        [name]: [
          {
            label: '',
            value: ''
          }
        ]
      }}
      onSubmit={(values) => console.log(values)}
    >
      {({ values, handleSubmit }) => (
        <Form>
          <FormikFieldArrayE
            name={name}
            values={values}
            typeOptions={[
              { label: 'Red Social', value: 'socialMedia' },
              { label: 'Bancaria', value: 'bankInfo' }
            ]}
          />
          <Button onPress={handleSubmit}>Submit</Button>
        </Form>
      )}
    </Formik>
  </div>
)

export default FormikArray
