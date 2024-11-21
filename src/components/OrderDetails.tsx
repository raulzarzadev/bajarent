import { Text, View, Linking, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import OrderType, { order_status, order_type } from '../types/OrderType'
import P from './P'
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
import PaymentVerify from './PaymentVerify'
import ButtonCreateClient from './ButtonCreateClient'
import RowOrderItem from './RowOrderItem'
import { useOrderDetails } from '../contexts/orderContext'
import { OrderActionsE } from './OrderActions/OrderActions2'
import ModalRepairItem from './ModalRepairItem'
import OrderContacts from './OrderContacts'
import useMyNav from '../hooks/useMyNav'
import OrderBigStatus from './OrderBigStatus'
import Divider from './Divider'
import { useStore } from '../contexts/storeContext'

const OrderDetailsA = ({ order }: { order: Partial<OrderType> }) => {
  console.log({ order })
  const [defaultAmount, setDefaultAmount] = useState(0)
  useEffect(() => {
    if (order?.type === order_type.REPAIR) {
      setDefaultAmount(order?.quote?.amount || order?.repairTotal || 0)
    }
    const multiItemOrderAmount = order?.items?.reduce((acc, item) => {
      const price = item?.priceSelected?.amount || 0
      const qty = item?.priceQty || 1

      // ? * qty should be 1 always ?
      //FIXME: This is a problem when you update items , types and price selected ...
      return acc + price * qty
    }, 0)
    if (order?.type === order_type.RENT) {
      setDefaultAmount(multiItemOrderAmount)
    }
  }, [])

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
      <OrderBigStatus />

      <View
        style={{
          padding: 4,
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <ClientName order={order} style={gStyles.h1} />
        <ButtonCreateClient
          client={{
            name: order?.fullName || '',
            phone: order?.phone || '',
            neighborhood: order?.neighborhood || '',
            address: order?.address || '',
            imageHouse: order?.imageHouse || null,
            imageID: order?.imageID || null,
            isActive: order.status === order_status.DELIVERED
          }}
          storeId={order.storeId}
          orderId={order.id}
          clientId={order.clientId}
        />
      </View>

      <OrderContacts />
      <OrderImages order={order} />

      <ErrorBoundary componentName="OrderAddress">
        <OrderAddress order={order} />
      </ErrorBoundary>
      <View style={{ marginTop: 8 }} />
      <OrderActionsE />
      {order.type === order_type.RENT && (
        <ErrorBoundary componentName="OrderItems">
          <View
            style={{
              marginVertical: 8,
              paddingBottom: 16,
              backgroundColor: theme?.base,
              width: '100%',
              paddingHorizontal: 4
            }}
          >
            <OrderItems order={order} />
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

const OrderAddress = ({ order }: { order: Partial<OrderType> }) => {
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

const OrderItems = ({ order }: { order: Partial<OrderType> }) => {
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
  const { payments, setPaymentsCount } = useOrderDetails()
  const { storeId } = useStore()
  const { toPayments } = useMyNav()
  const sortByCreatedAt = (a: PaymentType, b: PaymentType) => {
    return asDate(a.createdAt).getTime() < asDate(b.createdAt).getTime()
      ? 1
      : -1
  }
  const [count, setCount] = useState(2)
  const MAX_PAYMENTS_COUNT = 10
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
              disabled={count > MAX_PAYMENTS_COUNT}
              onPress={() => {
                setPaymentsCount(count + 5)
                setCount(count + 5)
              }}
              label="mostrar más"
            ></Button>
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
