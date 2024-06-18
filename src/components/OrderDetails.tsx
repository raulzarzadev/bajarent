import { Text, View, Image, Linking, Pressable, ViewStyle } from 'react-native'
import React, { useEffect, useState } from 'react'
import OrderType, { order_type } from '../types/OrderType'
import P from './P'
import CardPhone from './CardPhone'
import theme, { colors } from '../theme'
import asDate, { dateFormat } from '../libs/utils-date'
import CurrencyAmount from './CurrencyAmount'
import OrderComments from './OrderComments'
import { gSpace, gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import ClientName from './ClientName'
import ModalRepairQuote from './ModalRepairQuote'
import ModalPayment from './ModalPayment'
import { Timestamp } from 'firebase/firestore'
import DateCell from './DateCell'
import OrderActions from './OrderActions/OrderActions'
import SpanMetadata from './SpanMetadata'
import Totals from './ItemsTotals'
import { ServicePayments } from '../firebase/ServicePayments'
import PaymentType from '../types/PaymentType'
import { TimePriceType } from '../types/PriceType'
import { translateTime } from '../libs/expireDate'
import { OrderDirectivesE } from './OrderDirectives'
import Button from './Button'
import LinkLocation from './LinkLocation'
import { useNavigation } from '@react-navigation/native'
import { useOrdersCtx } from '../contexts/ordersContext'
import dictionary from '../dictionary'
import SpanUser from './SpanUser'
import OrderImages from './OrderImages'
import OrderExtensions from './OrderExtensions'
import Icon from './Icon'
import PaymentVerify from './PaymentVerify'
import RowItem from './RowItem'

const OrderDetailsA = ({ order }: { order: Partial<OrderType> }) => {
  console.log({ order })
  const multiItemOrder = order?.items?.length > 0
  const multiItemOrderAmount = order?.items?.reduce((acc, item) => {
    const price = item?.priceSelected?.amount || 0
    const qty = item?.priceQty || 1

    // ? * qty should be 1 always ?
    return acc + price * qty
  }, 0)
  const singleItemAmount =
    order?.item?.priceSelected?.amount * order?.item?.priceQty
  const defaultAmount = multiItemOrder ? multiItemOrderAmount : singleItemAmount

  return (
    <View>
      <OrderMetadata order={order} />
      <View style={{ justifyContent: 'center', margin: 'auto' }}>
        <OrderDirectivesE order={order} />
      </View>
      <View
        style={{
          padding: 4
        }}
      >
        <ClientName order={order} style={gStyles.h1} />
      </View>
      <CardPhone phone={order?.phone} />
      <OrderImages order={order} />

      <ErrorBoundary componentName="OrderAddress">
        <OrderAddress order={order} />
      </ErrorBoundary>
      {order?.type !== order_type.REPAIR && (
        <ErrorBoundary componentName="ItemDetails">
          <ItemDetails order={order} />
        </ErrorBoundary>
      )}

      {order?.type === order_type.REPAIR && (
        <ErrorBoundary componentName="ModalRepairQuote">
          <View
            style={{
              marginVertical: 16,
              paddingVertical: 16,
              backgroundColor: theme?.base,
              width: '100%'
            }}
          >
            <ModalRepairQuote
              orderId={order?.id}
              quote={{
                info: order?.repairInfo || '',
                total: order?.repairTotal || 0,
                brand: order?.itemBrand || '',
                serial: order?.itemSerial || '',
                category:
                  order?.items?.[0]?.categoryName ||
                  order?.item?.categoryName ||
                  'Sin articulo',
                failDescription: order?.description || ''
              }}
            />
          </View>
        </ErrorBoundary>
      )}

      <OrderPayments orderId={order.id} />

      <View
        style={{
          maxWidth: 190,
          marginHorizontal: 'auto',
          marginBottom: 16
        }}
      >
        <ModalPayment
          orderId={order.id}
          storeId={order.storeId}
          defaultAmount={defaultAmount}
        />
      </View>

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

const OrderAddress = ({ order }: { order: Partial<OrderType> }) => {
  const neighborhood = order?.neighborhood || ''
  const street = order?.street || ''
  const betweenStreets = order?.betweenStreets || ''
  const address = order?.address || ''
  const references = order?.references || ''

  const location = order?.location || ''

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
        {/* {!!neighborhood ||
        !!street ||
        !!betweenStreets ||
        !!address ||
        !!address ||
        !!references ? (
          <ButtonSearchLocation location={location} />
        ) : (
          <Text>Sin dirección</Text>
        )} */}
      </View>
    </View>
  )
}

const ItemDetails = ({ order }: { order: Partial<OrderType> }) => {
  const items = [...(order.items || [])]
  // console.log({ item: order.item })
  //* NOTE: not show item. These will hide older orders item. :X
  // if (order?.item) items?.push(order.item)
  return (
    <View
      style={{
        marginVertical: 16,
        paddingVertical: 16,
        backgroundColor: theme?.base,
        width: '100%'
      }}
    >
      <Text
        style={[gStyles.h2, { marginVertical: gSpace(4), marginBottom: 4 }]}
      >
        Artículos
      </Text>
      {!!order?.itemSerial && (
        <Text style={[gStyles.helper, gStyles.tCenter, { marginBottom: 8 }]}>
          serie: {order?.itemSerial}
        </Text>
      )}

      {items?.map((item, i) => (
        <RowItem item={item} key={item.id} />
      ))}

      <Totals items={order.items} />
      {order?.extensions ? (
        <OrderExtensions order={order} />
      ) : (
        <View style={{ marginTop: gSpace(3) }}>
          <ItemDates
            expireAt={order.expireAt}
            scheduledAt={order.scheduledAt}
            startedAt={order.deliveredAt}
            extendTime={order.extendTime}
          />
        </View>
      )}
    </View>
  )
}

const ItemDates = ({
  scheduledAt,
  expireAt,
  startedAt,
  extendTime
}: {
  scheduledAt?: Date | Timestamp
  expireAt?: Date | Timestamp
  startedAt?: Date | Timestamp
  extendTime?: TimePriceType
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
        {!!expireAt && !!startedAt && (
          <DateCell label="Vence" date={expireAt} showTime labelBold />
        )}
      </View>
    </>
  )
}

const OrderPayments = ({ orderId }: { orderId: string }) => {
  const [payments, setPayments] = useState<PaymentType[]>([])
  const { navigate } = useNavigation()
  useEffect(() => {
    if (orderId) {
      ServicePayments.listenByOrder(orderId, setPayments)
    }
    return () => {}
  }, [orderId])

  const sortByCreatedAt = (a: PaymentType, b: PaymentType) => {
    return asDate(a.createdAt).getTime() < asDate(b.createdAt).getTime()
      ? 1
      : -1
  }

  return (
    <View>
      {payments?.length > 0 && (
        <ErrorBoundary componentName="ModalPayment">
          <View
            style={{
              maxWidth: '100%',
              marginHorizontal: 'auto',
              marginVertical: 16,
              marginTop: 8
            }}
          >
            <Text style={gStyles.h3}>Pagos</Text>
            {payments.sort(sortByCreatedAt)?.map((payment) => (
              <Pressable
                onPress={() => {
                  //@ts-ignore
                  navigate('StackPayments', {
                    screen: 'ScreenPaymentsDetails',
                    params: { id: payment.id }
                  })
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
          </View>
        </ErrorBoundary>
      )}
    </View>
  )
}

export const OrderMetadata = ({ order }: { order: Partial<OrderType> }) => {
  const { navigate } = useNavigation()
  const { consolidatedOrders } = useOrdersCtx()
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
        <View>
          {order?.renewedTo && (
            <Text>
              Renovada con:{' '}
              <Pressable
                onPress={() => {
                  //@ts-ignore
                  navigate('OrderDetails', { orderId: order?.renewedTo })
                }}
              >
                <Text>
                  {consolidatedOrders?.orders?.[order.renewedTo]?.folio} -{' '}
                  {consolidatedOrders?.orders?.[order.renewedTo]?.note || ''}
                </Text>
              </Pressable>
            </Text>
          )}
          {order?.renewedFrom && (
            <Text>
              Renovada de:{' '}
              <Pressable
                onPress={() => {
                  //@ts-ignore

                  navigate('OrderDetails', { orderId: order?.renewedFrom })
                }}
              >
                <Text>
                  {consolidatedOrders?.orders?.[order.renewedFrom]?.folio} -{' '}
                  {consolidatedOrders?.orders?.[order.renewedFrom]?.note || ''}
                </Text>
              </Pressable>
            </Text>
          )}
        </View>
        <View>
          <Text style={{ textAlign: 'center' }}>
            <P bold size="lg">
              Folio:{' '}
            </P>
            <P size="lg">{order?.folio}</P>
          </Text>
          {!!order?.note && (
            <Text style={{ textAlign: 'center' }}>
              <P bold size="lg">
                Contrato:{' '}
              </P>
              <P size="lg">{order?.note}</P>
            </Text>
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
