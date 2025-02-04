import { ScrollView, View } from 'react-native'
import Buttons from './Buttons'
import { InputsE } from './Inputs'
import TextInfos from './TextInfos'
import Chips from './Chips'
import { FormikSaleOrderItemsE } from './FormikSaleOrderItems'
import { Formik } from 'formik'
import { gStyles } from '../styles'
import { order_status, order_type } from '../types/OrderType'
import { RowOrderE } from './RowOrder'
import { ModalCreateCustomersE } from './ModalCreateCustomers'

const ScreenComponents = () => {
  return (
    <ScrollView>
      <View style={gStyles.container}>
        <ModalCreateCustomersE />
      </View>
      <View style={gStyles.container}>
        <RowOrderE
          //@ts-ignore
          item={{
            firstName: 'Manuel Trath',
            type: order_type.SALE,
            id: '1',
            folio: 1,
            name: 'name',
            neighborhood: 'neighborhood',
            phone: 'phone',
            status: order_status.AUTHORIZED,
            itemsNumbers: '1, 2, 3',
            itemsString: '(3) 1, 2, 3',
            isAuthorized: true,
            assignToSectionName: 'section',
            hasImportantComment: true,
            markedToCollect: true,
            markedToCharge: true,

            comments: [
              //@ts-ignore
              {
                type: 'important',
                solved: false,
                content: 'content'
              }
            ]
          }}
        />
        <RowOrderE
          //@ts-ignore
          item={{
            firstName: 'Manuel ',
            type: order_type.RENT,
            id: '443',
            folio: 123,
            name: 'name',
            neighborhood: 'neighborhood',
            phone: 'phone',
            status: order_status.DELIVERED,
            deliveredAt: new Date(),
            itemsString: '000345',
            isAuthorized: true,
            hasImportantComment: true
          }}
        />
        <RowOrderE
          //@ts-ignore
          item={{
            firstName: 'Manuel Direleret Graham ',
            type: order_type.RENT,
            id: '3423',
            folio: 9045,
            note: 'note-34',
            name: 'name',
            neighborhood: 'neighborhood',
            phone: 'phone',
            status: order_status.DELIVERED,
            deliveredAt: new Date(),
            itemsNumbers: '1, 2, 3',
            itemsString: '(3) 1, 2, 3',
            isAuthorized: true,
            hasImportantComment: true,
            customerId: 'undefined'
          }}
        />
      </View>
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
