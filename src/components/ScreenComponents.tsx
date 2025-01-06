import { ScrollView, View } from 'react-native'
import Buttons from './Buttons'
import { InputsE } from './Inputs'
import TextInfos from './TextInfos'
import Chips from './Chips'
import { FormikSaleOrderItemsE } from './FormikSaleOrderItems'
import { Formik } from 'formik'
import { gStyles } from '../styles'
import { order_type } from '../types/OrderType'

const ScreenComponents = () => {
  return (
    <ScrollView>
      <View style={gStyles.container}>
        <Formik
          initialValues={{
            type: order_type.SALE,
            items: [
              {
                category: '',
                serial: '',
                quantity: 1,
                price: 0
              }
            ]
          }}
          onSubmit={() => {}}
        >
          {({}) => <FormikSaleOrderItemsE name="items" />}
        </Formik>
      </View>
      <Buttons />
      <InputsE />
      <TextInfos />
      <Chips />
    </ScrollView>
  )
}

export default ScreenComponents
