import { Text, View, Linking, Pressable } from 'react-native'
import OrderType, { order_status, order_type } from '../types/OrderType'
import theme, { colors } from '../theme'
import asDate, { dateFormat } from '../libs/utils-date'
import CurrencyAmount from './CurrencyAmount'
import OrderComments from './OrderComments'
import { gSpace, gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import ModalRepairQuote from './ModalRepairQuote'
import ModalPayment from './ModalPayment'
import { Timestamp } from 'firebase/firestore'
import DateCell from './DateCell'
import OrderActions from './OrderActions/OrderActions'
import SpanMetadata from './SpanMetadata'
import Totals from './ItemsTotals'
import PaymentType from '../types/PaymentType'
import { TimePriceType } from '../types/PriceType'
import { translateTime } from '../libs/expireDate'
import { OrderDirectivesE } from './OrderDirectives'
import Button from './Button'
import LinkLocation from './LinkLocation'
import dictionary from '../dictionary'
import SpanUser from './SpanUser'
import OrderExtensions from './OrderExtensions'
import PaymentVerify from './PaymentVerify'
import RowOrderItem from './RowOrderItem'
import { useOrderDetails } from '../contexts/orderContext'
import { OrderActionsE } from './OrderActions/OrderActions2'
import ModalRepairItem from './ModalRepairItem'
import useMyNav from '../hooks/useMyNav'
import { useStore } from '../contexts/storeContext'
import { ConsolidatedOrderType } from '../firebase/ServiceConsolidatedOrders'
import ModalChangeOrderFolio from './ModalChangeOrderFolio'
import { useEmployee } from '../contexts/employeeContext'
import { SaleItemsInfoE } from './SaleItemsInfo'
import { CustomerOrderE } from './Customers/CustomerOrder'
import OrderBigStatus from './OrderBigStatus'

const OrderDetailsA = ({ order }: { order: Partial<OrderType> }) => {
  if (order?.isConsolidated) {
    const consolidated = order as unknown as ConsolidatedOrderType
    return (
      <View>
        <Text>Orden consolidada</Text>
        <Text>Esta orden fue eliminada o no se encuentra. </Text>
        <Text>id: {consolidated.id}</Text>
        <Text>Folio: {consolidated.folio}</Text>
        <Text>contrato: {consolidated.note}</Text>
        <Text>Colonia: {consolidated.neighborhood}</Text>
        <Text>Nombre: {consolidated.fullName}</Text>
        <Text>Estado: {consolidated.status}</Text>
        <Text>Fecha: {dateFormat(asDate(consolidated.createdAt))}</Text>
        <Text>Programada: {dateFormat(asDate(consolidated.scheduledAt))}</Text>
        <Text>Recogida: {dateFormat(asDate(consolidated.pickedUpAt))}</Text>
        <Text>Cancelada: {dateFormat(asDate(consolidated.cancelledAt))}</Text>
        <Text>Entregada:{dateFormat(asDate(consolidated.deliveredAt))}</Text>
        <Text>Expira: {dateFormat(asDate(consolidated.expireAt))}</Text>
        <Text>Items: {consolidated.itemsString}</Text>
        <Text>Items:</Text>
        {consolidated?.items?.map((item, i) => {
          return (
            <View key={i}>
              <Text>
                <Text>{item?.categoryName} </Text>
                {item?.number}
              </Text>
            </View>
          )
        })}
        <View>
          {/**@ts-ignore */}
          {consolidated?.comments?.map((comment) => {
            return (
              <View key={comment?.id}>
                <Text>{comment.content}</Text>
              </View>
            )
          })}
        </View>
        <Text>{consolidated?.phone}</Text>
        <Text>
          {Object.entries(consolidated?.extensions || {}).map(
            ([id, extension]) => (
              <View key={id}>
                <Text>
                  {dateFormat(asDate(extension?.createdAt))} -{' '}
                  {extension?.reason} - De{' '}
                  {dateFormat(asDate(extension?.startAt))} al{' '}
                  {dateFormat(asDate(extension?.expireAt))}
                </Text>
              </View>
            )
          )}
        </Text>
        <Text>{consolidated.location}</Text>
      </View>
    )
  }

  return (
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

      <CustomerOrderE />
      <View style={{ marginTop: 8 }} />
      {/*//* <-----Order actions flow */}

      <OrderActionsE />
      {/*//* <-----Order actions flow */}

      {order.type === order_type.RENT && (
        <ErrorBoundary componentName="RentItemsInfo">
          <View
            style={{
              marginVertical: 8,
              paddingBottom: 16,
              backgroundColor: theme?.base,
              width: '100%',
              paddingHorizontal: 4
            }}
          >
            <RentItemsInfo order={order} />
            <Totals items={order.items} />
            {order?.extensions ? (
              <OrderExtensions order={order} />
            ) : (
              <View style={{ marginTop: gSpace(3) }}>
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
          </View>
        </ErrorBoundary>
      )}

      {order.type === order_type.SALE && <SaleItemsInfoE />}

      {order?.type === order_type.REPAIR && <RepairItemConfigInfo />}

      <OrderPayments orderId={order.id} />

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

      <ErrorBoundary componentName="OrderComments">
        <OrderComments orderId={order.id} />
      </ErrorBoundary>
    </View>
  )
}

export const RepairItemConfigInfo = () => {
  const { order } = useOrderDetails()
  return (
    <ErrorBoundary componentName="ModalRepairQuote">
      <View
        style={{
          marginVertical: 16,
          paddingVertical: 16,
          backgroundColor: theme?.base,
          width: '100%'
        }}
      >
        <View style={{ marginBottom: gSpace(4) }}>
          <ModalRepairItem />
        </View>
        <ModalRepairQuote orderId={order?.id} />
      </View>
    </ErrorBoundary>
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
    //@ts-ignore typo in form generete this error
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
      {items?.map((item, i) => (
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
            <ModalPayment orderId={orderId} storeId={storeId} />
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
