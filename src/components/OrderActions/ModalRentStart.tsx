import { View } from 'react-native'
import React from 'react'
import StyledModal from '../StyledModal'
import useModal, { ReturnModal } from '../../hooks/useModal'
import Button from '../Button'
import { onRentStart } from '../../libs/order-actions'
import { useAuth } from '../../contexts/authContext'
import { useOrderDetails } from '../../contexts/orderContext'
import FormRentDelivery from './FormRentDelivery'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import { ErrorsList } from '../FormikErrorsList'
import { useStore } from '../../contexts/storeContext'
import OrderType, { order_type } from '../../types/OrderType'
import InputCheckbox from '../Inputs/InputCheckbox'
import FormPayment from '../FormPayment'
import PaymentType, { PaymentBase } from '../../types/PaymentType'
import { ServicePayments } from '../../firebase/ServicePayments'
import { useCustomers } from '../../state/features/costumers/costumersSlice'

import { CustomerType } from '../../state/features/costumers/customerType'
import { createUUID } from '../../libs/createId'
import { useCurrentWork } from '../../state/features/currentWork/currentWorkSlice'

const ModalRentStart = ({ modal }: { modal: ReturnModal }) => {
  const { store, storeId } = useStore()
  const { order, customer } = useOrderDetails()
  const { user } = useAuth()
  const [isDirty, setIsDirty] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const { create } = useCustomers()
  const { addWork } = useCurrentWork()

  const handleRentStart = async ({
    lastPayment
  }: {
    lastPayment?: PaymentType
  } = {}) => {
    //*pickup items
    setIsLoading(true)
    await onRentStart({ order, userId: user.id, store, lastPayment, customer })
    addWork({
      work: {
        action: 'rent_delivered',
        type: 'order',
        details: {
          orderId: order.id,
          sectionId: order?.assignToSection || null
        }
      }
    })
    setIsLoading(false)
    modal.toggleOpen()
    return
  }

  const VALIDATE_ITEMS_QTY =
    store?.orderFields?.[order_type.RENT]?.validateItemsQty
  const ITEMS_MAX_BY_ORDER = parseInt(
    `${store?.orderFields?.[order_type.RENT].itemsMax || '0'}`
  )
  const ITEMS_MIN_BY_ORDER = parseInt(
    `${store?.orderFields?.[order_type.RENT]?.itemsMin || '0'}`
  )

  const itemsCount = order?.items?.length || 0
  const toMuchItems = itemsCount > ITEMS_MAX_BY_ORDER
  const toLittleItems = itemsCount < ITEMS_MIN_BY_ORDER
  const disabledByCountItems =
    VALIDATE_ITEMS_QTY && (toMuchItems || toLittleItems)

  const disabledDelivery = isDirty || isLoading || disabledByCountItems

  const [addPay, setAddPay] = React.useState(true)
  const [paymentModal, setPaymentModal] = React.useState(false)
  return (
    <View>
      <StyledModal {...modal}>
        <FormRentDelivery
          initialValues={order}
          onSubmit={async (values: OrderType) => {
            delete values.expireAt // <-- Do not update expireAt because
            //* update customer
            if (!values.customerId) {
              const contactId = createUUID({ length: 8 })
              const newCustomer: Partial<CustomerType> = {
                name: values.fullName || '',
                address: {
                  street: values.address || '',
                  references: values.references || '',
                  neighborhood: values.neighborhood || '',
                  locationURL: values.location || '',
                  coords: values.coords
                    ? `${values.coords[0]},${values.coords[1]}`
                    : null
                },
                contacts: {
                  [contactId]: {
                    label: 'Principal',
                    value: values.phone || '',
                    type: 'phone',
                    id: contactId
                  }
                }
              }
              const { payload } = await create(storeId, newCustomer)
              if (payload) {
                //@ts-ignore
                values.customerId = payload?.id
              }
            }

            await ServiceOrders.update(order.id, values)
              .then((res) => console.log(res))
              .catch((e) => console.error(e))
            return
          }}
          setDirty={(dirty) => {
            setIsDirty(dirty)
          }}
        />
        <ErrorsList
          errors={(() => {
            const errors = {}
            if (VALIDATE_ITEMS_QTY) {
              if (toMuchItems) {
                errors[
                  'items'
                ] = `Selecciona máximo ${ITEMS_MAX_BY_ORDER} artículo(s)`
              }

              if (toLittleItems) {
                errors[
                  'items'
                ] = `Selecciona mínimo ${ITEMS_MIN_BY_ORDER} artículo(s)`
              }
            }

            return errors
          })()}
        />

        {/* *** *** AGREGAR PAGO *** */}
        <AddPay
          addPay={addPay}
          setAddPay={setAddPay}
          paymentModal={paymentModal}
          setPaymentModal={setPaymentModal}
          handlePaidOrder={(paymentId) => {
            ServicePayments.get(paymentId).then((payment) => {
              handleRentStart({ lastPayment: payment })
            })
          }}
        />

        <Button
          disabled={disabledDelivery}
          variant={disabledDelivery ? 'ghost' : 'filled'}
          label="Entregar"
          onPress={async () => {
            if (addPay) {
              setPaymentModal(true)
              return
            } else {
              return await handleRentStart()
            }
          }}
        ></Button>
      </StyledModal>
    </View>
  )
}

const AddPay = ({
  addPay,
  setAddPay,
  paymentModal,
  setPaymentModal,
  handlePaidOrder
}) => {
  const { store } = useStore()
  const { order } = useOrderDetails()
  const modal = useModal()
  const payment: PaymentBase = {
    amount: 0,
    reference: '',
    date: new Date(),
    method: 'transfer',
    storeId: store.id,
    orderId: order.id
  }
  const { addWork } = useCurrentWork()

  const handleSavePayment = async ({ values }) => {
    const amount = parseFloat(values.amount || 0)
    return await ServicePayments.orderPayment({
      ...values,
      amount
    })
  }
  return (
    <View
      style={{
        marginVertical: 16,
        margin: 'auto'
      }}
    >
      <StyledModal
        {...paymentModal}
        title="Registrar pago"
        open={paymentModal}
        setOpen={() => setPaymentModal(!paymentModal)}
      >
        <FormPayment
          values={payment}
          onSubmit={async (values) => {
            modal.toggleOpen()
            try {
              const res = await handleSavePayment({ values })

              handlePaidOrder(res.res.id)
              const paymentId = res?.res?.id
              addWork({
                work: {
                  action: 'payment_created',
                  type: 'payment',
                  details: {
                    orderId: order.id,
                    paymentId,
                    sectionId: order?.assignToSection || null
                  }
                }
              })
              return
            } catch (error) {
              console.error({ error })
            }
          }}
        />
      </StyledModal>
      <InputCheckbox label="Agregar pago" setValue={setAddPay} value={addPay} />
    </View>
  )
}

export default ModalRentStart
