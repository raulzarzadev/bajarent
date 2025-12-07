import type { Timestamp } from 'firebase/firestore'
import { Linking, Pressable, Text, View } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import { useOrderDetails } from '../contexts/orderContext'
import { useStore } from '../contexts/storeContext'
import dictionary from '../dictionary'
import useMyNav from '../hooks/useMyNav'
import { translateTime } from '../libs/expireDate'
import asDate, { dateFormat } from '../libs/utils-date'
import { gSpace, gStyles } from '../styles'
import theme, { colors } from '../theme'
import type OrderType from '../types/OrderType'
import { order_status, order_type } from '../types/OrderType'
import type PaymentType from '../types/PaymentType'
import type { TimePriceType } from '../types/PriceType'
import Button from './Button'
import CurrencyAmount from './CurrencyAmount'
import { CustomerOrderE } from './Customers/CustomerOrder'
import DateCell from './DateCell'
import ErrorBoundary from './ErrorBoundary'
import Totals from './ItemsTotals'
import LinkLocation from './LinkLocation'
import ModalChangeOrderFolio from './ModalChangeOrderFolio'
import ModalPayment from './ModalPayment'
import ModalRepairItem from './ModalRepairItem'
import ModalRepairQuote from './ModalRepairQuote'
import OrderActions from './OrderActions/OrderActions'
import { OrderActionsE } from './OrderActions/OrderActions2'
import OrderBigStatus from './OrderBigStatus'
import OrderComments from './OrderComments'
import { OrderContractSignatureE } from './OrderContractSignature'
import { OrderDirectivesE } from './OrderDirectives'
import OrderExtensions from './OrderExtensions'
import { OrderImagesUpdateE } from './OrderImagesUpdate'
import PaymentVerify from './PaymentVerify'
import RowOrderItem from './RowOrderItem'
import { SaleItemsInfoE } from './SaleItemsInfo'
import SpanMetadata from './SpanMetadata'
import SpanUser from './SpanUser'
import TextInfo from './TextInfo'

const OrderDetailsA = ({ order }: { order: Partial<OrderType> }) => {
  const { store } = useStore()
  if (order?.isConsolidated) {
    return <View>Ordenes consolidadas ya no son validas</View>
  }

  const orderFields = store?.orderFields?.[order?.type]

  return (
    <View>
      <View>
        <OrderMetadata order={order} />
        <View
          style={{
            justifyContent: 'center',
            margin: 'auto',
            maxWidth: 400,
            width: '100%'
          }}
        >
          <OrderDirectivesE order={order} />
        </View>
        {order.orderIsNull && (
          <View>
            <TextInfo
              type="warning"
              text="No encotramos esta orden. ¡Parece que ha sido eliminada!"
              defaultVisible
            />
          </View>
        )}

        <OrderDetailSection>
          <CustomerOrderE />
        </OrderDetailSection>

        <OrderDetailSection>
          {/*//* <-----Order actions flow */}
          <OrderActionsE />
          {/*//* <-----Order actions flow */}
        </OrderDetailSection>

        <OrderDetailSection>
          {order.type === order_type.RENT && (
            <ErrorBoundary componentName="RentItemsInfo">
              <RentItemsInfo order={order} />
              <Totals items={order.items} />
              {order?.extensions ? (
                <OrderExtensions order={order} />
              ) : (
                <View>
                  <OrderDates
                    status={order.status}
                    expireAt={order.expireAt}
                    scheduledAt={order.scheduledAt}
                    startedAt={order.deliveredAt}
                    extendTime={order.extendTime}
                    pickedUp={order.pickedUpAt}
                  />
                </View>
              )}
            </ErrorBoundary>
          )}

          {order.type === order_type.SALE && <SaleItemsInfoE />}

          {order?.type === order_type.REPAIR && <RepairItemConfigInfo />}

          {/* Order images */}
          <OrderImagesUpdateE />
        </OrderDetailSection>

        {orderFields?.contractSignature && (
          <OrderDetailSection>
            {/*//* <-----Order signature ?*/}
            <OrderContractSignatureE />
          </OrderDetailSection>
        )}

        <OrderDetailSection>
          <OrderPayments orderId={order.id} />
        </OrderDetailSection>

        <OrderDetailSection>
          <ErrorBoundary componentName="OrderActions">
            {[
              order_type.RENT,
              order_type.MULTI_RENT,
              order_type.STORE_RENT,
              order_type.DELIVERY_RENT
            ].includes(order.type) && (
              <OrderActions
                orderId={order.id}
                orderType={'RENT'}
                orderStatus={order.status}
                storeId={order.storeId}
              />
            )}
            {order.type === order_type.SALE && (
              <OrderActions
                orderId={order.id}
                orderType={'SALE'}
                orderStatus={order.status}
                storeId={order.storeId}
              />
            )}
            {order.type === order_type.REPAIR && (
              <OrderActions
                orderId={order.id}
                orderType={'REPAIR'}
                orderStatus={order.status}
                storeId={order.storeId}
              />
            )}
          </ErrorBoundary>
        </OrderDetailSection>
      </View>

      <OrderDetailSection>
        <ErrorBoundary componentName="OrderComments">
          <OrderComments orderId={order.id} />
        </ErrorBoundary>
      </OrderDetailSection>
    </View>
  )
}

export const RepairItemConfigInfo = () => {
  const { order } = useOrderDetails()
  return (
    <ErrorBoundary componentName="ModalRepairQuote">
      <View style={{ marginBottom: gSpace(4) }}>
        <ModalRepairItem />
      </View>
      <ModalRepairQuote orderId={order?.id} />
    </ErrorBoundary>
  )
}

export const OrderDetailSection = ({ children }) => {
  return (
    <View
      style={{
        marginVertical: 8,
        backgroundColor: theme?.base,
        width: '100%',
        paddingHorizontal: 4,
        borderRadius: 8,
        paddingVertical: 4
      }}
    >
      {children}
    </View>
  )
}

/**
 * @deprecated now  address is from customers
 * @param param0
 * @returns
 */
export const OrderAddress = ({ order }: { order: Partial<OrderType> }) => {
  const neighborhood = order?.neighborhood || ''
  const street = order?.street || ''
  const betweenStreets = order?.betweenStreets || ''
  const address = order?.address || ''
  const references = order?.references || ''

  const location =
    order?.location ||
    //@ts-expect-error typo in form generete this error
    order?.Location ||
    ''
  if (!location) return null
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <View>
        <Text style={[gStyles.tCenter, gStyles.tBold]}>{neighborhood}</Text>
        <Text style={[gStyles.tCenter]}>{street}</Text>
        <Text style={[gStyles.tCenter]}>{betweenStreets}</Text>
        <Text style={[gStyles.tCenter]}>{address}</Text>
        <Text style={[gStyles.tCenter]}>{references}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: '100%',
          marginVertical: 8
        }}
      >
        <LinkLocation location={location} />
        <Button
          icon={'map'}
          disabled={!neighborhood}
          onPress={() => {
            Linking.openURL(`https://www.google.com/maps?q=${neighborhood}`)
          }}
          variant="ghost"
          justIcon
        />
      </View>
    </View>
  )
}

const RentItemsInfo = ({ order }: { order: Partial<OrderType> }) => {
  const items = order.items
  return (
    <View>
      <Text style={gStyles.h2}>Artículos</Text>
      {items?.map((item) => (
        <RowOrderItem
          item={item}
          key={item.id}
          order={order}
          itemId={item.id}
        />
      ))}
    </View>
  )
}

export const OrderDates = ({
  status,
  scheduledAt,
  expireAt,
  startedAt,
  extendTime,
  pickedUp
}: {
  status: OrderType['status']
  scheduledAt?: Date | Timestamp
  expireAt?: Date | Timestamp
  startedAt?: Date | Timestamp
  /**
   * @deprecated
   */
  extendTime?: TimePriceType
  pickedUp?: Date | Timestamp
}) => {
  return (
    <>
      <Text style={[gStyles.h3]}>Fechas</Text>
      {extendTime && (
        <Text style={[gStyles.helper, gStyles.tCenter, { marginBottom: 8 }]}>
          Se extendio por: {translateTime(extendTime)}
        </Text>
      )}

      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-evenly'
        }}
      >
        {!!scheduledAt && (
          <DateCell label="Programada" date={scheduledAt} showTime labelBold />
        )}
        {!!startedAt && (
          <DateCell label="Iniciado" date={startedAt} showTime labelBold />
        )}
        {!!expireAt && (
          <DateCell
            label="Vence"
            date={expireAt}
            showTime
            labelBold
            borderColor={status === order_status.DELIVERED && colors.green}
          />
        )}
        {!!pickedUp && status === order_status.PICKED_UP && (
          <DateCell
            label="Recogida"
            date={pickedUp}
            showTime
            labelBold
            borderColor={status === order_status.PICKED_UP && colors.lightBlue}
          />
        )}
      </View>
    </>
  )
}

const OrderPayments = ({ orderId }: { orderId: string }) => {
  const MAX_PAYMENTS_COUNT = 10
  const { payments, setPaymentsCount, paymentsCount } = useOrderDetails()
  const { storeId } = useStore()
  const { toPayments } = useMyNav()
  const sortByCreatedAt = (a: PaymentType, b: PaymentType) => {
    return asDate(a.createdAt).getTime() < asDate(b.createdAt).getTime()
      ? 1
      : -1
  }

  const { order } = useOrderDetails()

  return (
    <View>
      <ErrorBoundary componentName="OrderPayments">
        <View
          style={{
            maxWidth: '100%',
            marginHorizontal: 'auto',
            marginVertical: 16,
            marginTop: 8
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 8
            }}
          >
            <Text style={[gStyles.h3, { marginRight: 8, marginBottom: 0 }]}>
              Pagos
            </Text>
            <ModalPayment
              orderId={orderId}
              storeId={storeId}
              orderSectionId={order?.assignToSection}
            />
          </View>
          {payments.sort(sortByCreatedAt)?.map((payment) => (
            <Pressable
              onPress={() => {
                toPayments({ id: payment.id })
              }}
              key={payment.id}
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 6,
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                },
                payment?.canceled && {
                  backgroundColor: colors.lightGray,
                  opacity: 0.4
                }
              ]}
            >
              <SpanUser userId={payment.createdBy} />
              <Text style={{ marginHorizontal: 4 }}>
                {dateFormat(payment.createdAt, 'dd/MMM/yy HH:mm')}
              </Text>
              <Text style={{ marginHorizontal: 4 }}>
                {dictionary(payment.method)}
              </Text>
              <CurrencyAmount style={gStyles.tBold} amount={payment.amount} />
              {payment?.canceled && (
                <Text style={{ marginHorizontal: 4 }}>Cancelado</Text>
              )}
              <View style={{ marginLeft: 4 }}>
                <PaymentVerify payment={payment} />
              </View>
            </Pressable>
          ))}
          <Button
            size="xs"
            fullWidth={false}
            buttonStyles={{
              margin: 'auto'
            }}
            variant="ghost"
            disabled={
              payments?.length > MAX_PAYMENTS_COUNT ||
              payments?.length < paymentsCount
            }
            onPress={() => {
              setPaymentsCount(payments.length + 5)
            }}
            label="mostrar más"
          ></Button>
        </View>
      </ErrorBoundary>
    </View>
  )
}

export const OrderMetadata = ({ order }: { order: Partial<OrderType> }) => {
  const {
    permissions: { isAdmin }
  } = useEmployee()
  return (
    <View>
      <SpanMetadata
        createdAt={order?.createdAt}
        createdBy={order?.createdBy}
        id={order?.id}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: 8
        }}
      >
        <OrderBigStatus />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            {isAdmin ? <ModalChangeOrderFolio /> : null}
            <Text
              style={{
                textAlign: 'right'
              }}
            >
              <Text style={gStyles.helper}>Folio: </Text>
            </Text>
            <Text style={gStyles.h1}>{order?.folio}</Text>
          </View>
          {!!order?.note && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text
                style={{
                  textAlign: 'center'
                }}
              >
                <Text style={gStyles.helper}>Contrato: </Text>
              </Text>
              <Text style={gStyles.h2}>{order?.note}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default function OrderDetails(props: { order: Partial<OrderType> }) {
  return (
    <ErrorBoundary componentName="OrderDetails">
      <OrderDetailsA {...props} />
    </ErrorBoundary>
  )
}
export const OrderDetailsE = (props) => (
  <ErrorBoundary componentName="OrderDetails">
    <OrderDetails {...props} />
  </ErrorBoundary>
)
