import { Text, View, Image, StyleSheet } from 'react-native'
import React from 'react'
import OrderType, { order_type } from '../types/OrderType'
import P from './P'
import CardPhone from './CardPhone'
import theme from '../theme'
import asDate, { dateFormat, fromNow } from '../libs/utils-date'
import CurrencyAmount from './CurrencyAmount'
import OrderComments from './OrderComments'
import dictionary from '../dictionary'
import Chip from './Chip'
import OrderStatus from './OrderStatus'
import { gSpace, gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import OrderAssignedTo from './OrderAssignedTo'
import ClientName from './ClientName'
import ButtonSearchLocation from './ButtonSearchLocation'
import ModalRepairQuote from './ModalRepairQuote'
import ModalPayment from './ModalPayment'
import { Timestamp } from 'firebase/firestore'
import DateCell from './DateCell'
import { Totals } from './FormikSelectItems'
import OrderActions from './OrderActions/OrderActions'

const OrderDetailsA = ({ order }: { order: Partial<OrderType> }) => {
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

      <OrderDirectives order={order} />
      <View
        style={{
          padding: 4
        }}
      >
        <ClientName order={order} style={gStyles.h1} />
      </View>
      <CardPhone phone={order?.phone} />
      <View>
        {!!order?.imageID && (
          <Image
            source={{ uri: order?.imageID }}
            style={{ width: '100%', minHeight: 150, marginVertical: 2 }}
          />
        )}
        {!!order?.imageID && (
          <Image
            source={{ uri: order?.imageHouse }}
            style={{ width: '100%', minHeight: 150, marginVertical: 2 }}
          />
        )}
      </View>

      <ErrorBoundary componentName="OrderAddress">
        <OrderAddress order={order} />
      </ErrorBoundary>
      <ErrorBoundary componentName="ItemDetails">
        <ItemDetails order={order} />
      </ErrorBoundary>

      {order?.type === order_type.REPAIR && (
        <ErrorBoundary componentName="ModalRepairQuote">
          <View
            style={{
              maxWidth: 230,
              marginHorizontal: 'auto',
              marginTop: 4,
              marginBottom: 8
            }}
          >
            <ModalRepairQuote
              orderId={order.id}
              quote={{
                info: order?.repairInfo,
                total: order?.repairTotal
              }}
            />
          </View>
        </ErrorBoundary>
      )}

      {order?.payments?.length > 0 && (
        <ErrorBoundary componentName="ModalPayment">
          <View
            style={{
              maxWidth: 190,
              marginHorizontal: 'auto',
              marginVertical: 16,
              marginTop: 8
            }}
          >
            <Text style={gStyles.h3}>Pagos</Text>
            {order.payments?.map((payment) => (
              <View
                key={payment.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 6
                }}
              >
                <Text style={{ marginRight: 8 }}>
                  {dateFormat(payment.createdAt, 'dd/MMM/yy HH:mm')}
                </Text>
                <CurrencyAmount style={gStyles.tBold} amount={payment.amount} />
              </View>
            ))}
          </View>
        </ErrorBoundary>
      )}

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
      <View>
        {!!neighborhood ||
        !!street ||
        !!betweenStreets ||
        !!address ||
        !!address ||
        !!references ? (
          <ButtonSearchLocation location={location} />
        ) : (
          <Text>Sin dirección</Text>
        )}
      </View>
    </View>
  )
}

const ItemDetails = ({ order }: { order: Partial<OrderType> }) => {
  if (order?.items?.length > 0) {
    return (
      <View
        style={{
          marginVertical: 16,
          paddingVertical: 16,
          backgroundColor: theme?.base,
          margin: 4
        }}
      >
        <Text style={[gStyles.h2, { marginVertical: gSpace(4) }]}>
          Artículos
        </Text>
        {order.itemSerial && (
          <Text style={[gStyles.p, gStyles.tCenter]}>
            No.Serie: {order.itemSerial}
          </Text>
        )}
        {order?.items?.map((item) => (
          <View
            key={item.id}
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-evenly'
            }}
          >
            <Text style={[gStyles.h3]}>{item.categoryName}</Text>
            <Text style={[gStyles.p, gStyles.tCenter]}>
              {/* <Text style={gStyles.helper}>{item.priceQty || 1}x</Text>{' '} */}
              {item.priceSelected?.title}
            </Text>
            <CurrencyAmount
              style={gStyles.h3}
              amount={(item.priceSelected?.amount || 0) * (item.priceQty || 1)}
            />
          </View>
        ))}

        <Totals items={order.items} />
        <View style={{ marginTop: gSpace(3) }}>
          <ItemDates
            expireAt={order.expireAt}
            scheduledAt={order.scheduledAt}
            startedAt={order.deliveredAt}
          />
        </View>
      </View>
    )
  }
  if (!order?.item)
    return (
      <View
        style={{
          marginVertical: 16,
          paddingVertical: 16,
          backgroundColor: theme?.base,
          margin: 4
        }}
      >
        {order.itemSerial && (
          <Text style={[gStyles.p, gStyles.tCenter]}>
            No.Serie: {order.itemSerial}
          </Text>
        )}
        <Text style={[gStyles.h2, { marginVertical: gSpace(4) }]}>
          Sin artículos
        </Text>
      </View>
    )
  return (
    <View
      style={{
        marginVertical: 16,
        paddingVertical: 16,
        backgroundColor: theme?.base,
        margin: 4
      }}
    >
      <Text style={[gStyles.h3, { marginBottom: 8 }]}>Artículo</Text>
      {order.itemSerial && (
        <Text style={[gStyles.p, gStyles.tCenter]}>
          No.Serie: {order.itemSerial}
        </Text>
      )}
      <View>
        <View>
          <Text style={[gStyles.h3]}>{order?.item?.categoryName}</Text>
          <Text style={[gStyles.p, gStyles.tCenter]}>
            <Text style={gStyles.helper}>{order?.item?.priceQty || 1}x</Text>{' '}
            {order?.item?.priceSelected?.title}
          </Text>
          <CurrencyAmount
            style={gStyles.h1}
            amount={
              (order?.item?.priceSelected?.amount || 0) *
              (order?.item?.priceQty || 1)
            }
          />
          <View style={{ marginTop: gSpace(3) }}>
            <ItemDates
              expireAt={order.expireAt}
              scheduledAt={order.scheduledAt}
              startedAt={order.deliveredAt}
            />
          </View>
        </View>
      </View>
      {order.type === order_type.REPAIR && (
        <View>
          <Text style={[gStyles.p, gStyles.tCenter]}>
            {order?.item?.categoryName}
          </Text>
          <Text style={[gStyles.p, gStyles.tCenter]}>{order?.description}</Text>
          <Text style={[gStyles.p, gStyles.tCenter]}>{order?.itemBrand}</Text>
          <Text style={[gStyles.p, gStyles.tCenter]}>{order?.itemSerial}</Text>

          <Text style={gStyles.h3}>Detalles de cotización </Text>
          <Text style={[gStyles.p, gStyles.tCenter]}>{order?.repairInfo}</Text>
          <Text style={[gStyles.p, gStyles.tCenter]}>
            <CurrencyAmount style={gStyles.tBold} amount={order?.repairTotal} />
          </Text>
        </View>
      )}
    </View>
  )
}
const ItemDates = ({
  scheduledAt,
  expireAt,
  startedAt
}: {
  scheduledAt?: Date | Timestamp
  expireAt?: Date | Timestamp
  startedAt?: Date | Timestamp
}) => {
  return (
    <>
      <Text style={[gStyles.h3, { marginBottom: 8 }]}>Fechas</Text>
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
          <DateCell label="Expira" date={expireAt} showTime labelBold />
        )}
      </View>
    </>
  )
}
export const OrderDirectives = ({ order }: { order: Partial<OrderType> }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      <Chip
        style={styles.chip}
        title={dictionary(order?.type)?.toUpperCase()}
        color={theme?.info}
        titleColor={theme.black}
        size="sm"
      ></Chip>
      <OrderStatus
        orderId={order?.id}
        chipStyles={styles.chip}
        chipSize={'sm'}
      />
      <OrderAssignedTo
        orderId={order?.id}
        chipStyles={styles.chip}
        chipSize={'sm'}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  chip: {
    margin: 2,
    maxWidth: 105
  }
})

export const OrderMetadata = ({ order }: { order: Partial<OrderType> }) => {
  return (
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
        <Text style={gStyles.helper}>
          {` ${dateFormat(order?.createdAt, 'dd/MMM/yy HH:mm')} ${fromNow(
            order?.createdAt
          )} `}
        </Text>
        <Text style={gStyles.helper}> {order?.id}</Text>
      </View>
      <View>
        <Text style={{ textAlign: 'center' }}>
          <P bold size="lg">
            Folio:{' '}
          </P>
          <P size="lg">{order?.folio}</P>
        </Text>
        {order?.note && (
          <Text style={{ textAlign: 'center' }}>
            <P bold size="lg">
              Nota:{' '}
            </P>
            <P size="lg">{order?.note}</P>
          </Text>
        )}
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
