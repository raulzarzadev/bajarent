import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ListRow from './ListRow'
import asDate, { dateFormat } from '../libs/utils-date'
import SpanUser from './SpanUser'
import dictionary from '../dictionary'
import { translateTime } from '../libs/expireDate'
import DateCell from './DateCell'
import { gStyles } from '../styles'
import OrderType from '../types/OrderType'
import Button from './Button'
import ButtonConfirm from './ButtonConfirm'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { deleteField } from 'firebase/firestore'
import TextInfo from './TextInfo'

const OrderExtensions = ({ order }: { order: Partial<OrderType> }) => {
  const extensionsObj = order?.extensions || {}
  const extensions = Object.values(extensionsObj).sort((a, b) => {
    return asDate(a?.createdAt).getTime() < asDate(b?.createdAt).getTime()
      ? 1
      : -1
  })
  const expireAt = order?.expireAt
  // FIXME: some times extensions are not created properly
  const handleCancelExtension = async ({ extensionId, orderId }) => {
    const prevExtension = extensions?.[1]
    await ServiceOrders.update(orderId, {
      expireAt: prevExtension?.expireAt,
      [`extensions.${extensionId}`]: deleteField()
    })
      .then(console.log)
      .catch(console.error)
  }
  const isTheLast = (id) => {
    return extensions[0].id === id
  }

  return (
    <View style={{ padding: 4 }}>
      {!!expireAt && (
        <DateCell label="Vence" date={expireAt} showTime labelBold />
      )}
      <Text style={gStyles.h3}>Extenciones </Text>
      <ListRow
        fields={[
          {
            width: 100,
            component: <Text style={gStyles.tBold}>Creación</Text>
          },
          {
            width: 'rest',
            component: <Text style={gStyles.tBold}>Tipo</Text>
          },
          {
            width: 80,
            component: <Text style={gStyles.tBold}>Comienza</Text>
          },
          {
            width: 80,
            component: <Text style={gStyles.tBold}>Termina</Text>
          }
        ]}
      />
      {extensions.map(
        ({
          startAt,
          expireAt,
          createdBy,
          createdAt,
          id = 'id',
          reason,
          time
        }) => (
          <View
            key={id}
            style={{
              flexDirection: 'row',
              marginVertical: 4,
              justifyContent: 'space-around'
            }}
          >
            <ListRow
              fields={[
                {
                  width: 100,
                  component: (
                    <View>
                      <SpanUser userId={createdBy} />
                      <Text>
                        {dateFormat(asDate(createdAt), 'ddMMM HH:mm')}
                      </Text>
                    </View>
                  )
                },
                {
                  width: 'rest',
                  component: (
                    <View>
                      <Text>{dictionary(reason)}</Text>
                      <Text numberOfLines={1}>{translateTime(time)}</Text>
                    </View>
                  )
                },
                {
                  width: 80,
                  component: (
                    <DateCell date={startAt} showTimeAgo={false} showTime />
                  )
                },
                {
                  width: 80,
                  component: (
                    <DateCell date={expireAt} showTimeAgo={false} showTime />
                  )
                },
                {
                  width: 50,
                  component: (
                    <View>
                      {isTheLast(id) && (
                        <ButtonConfirm
                          icon="close"
                          justIcon
                          openColor="error"
                          openSize="small"
                          confirmColor="error"
                          confirmLabel="Eliminar extención"
                          handleConfirm={async () => {
                            await handleCancelExtension({
                              extensionId: id,
                              orderId: order.id
                            })
                          }}
                        >
                          <TextInfo
                            type="info"
                            text="Las extensiones solo pueden ser eliminadas una por
                            una, para evtiar conflictos de fechas"
                          />
                        </ButtonConfirm>
                      )}
                    </View>
                  )
                }
              ]}
            />
          </View>
        )
      )}
    </View>
  )
}

export default OrderExtensions

const styles = StyleSheet.create({})
