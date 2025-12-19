import { Image, Text, View } from 'react-native'
import { usePDF } from 'react-to-pdf'
// Corregir la importación de RNHTMLtoPDF
import { useOrderDetails } from '../../contexts/orderContext'
import dictionary from '../../dictionary'
import useModal from '../../hooks/useModal'
import asDate, { dateFormat } from '../../libs/utils-date'
import { gStyles } from '../../styles'
import { order_type } from '../../types/OrderType'
import type PaymentType from '../../types/PaymentType'
import Button from '../Button'
import CurrencyAmount from '../CurrencyAmount'
import ErrorBoundary from '../ErrorBoundary'
import StyledModal from '../StyledModal'
import { useStore } from '../../contexts/storeContext'

const ButtonDownloadOrder = () => {
  const modal = useModal({ title: 'Descargar PDF' })
  return (
    <View>
      <Button
        size="small"
        fullWidth={true}
        variant="outline"
        label="PDF"
        icon="filePDF"
        onPress={async () => {
          modal.toggleOpen()
        }}
      />
      <StyledModal {...modal} size="full">
        <OrderPDF />
      </StyledModal>
    </View>
  )
}

export default ButtonDownloadOrder

export const ButtonDownloadOrderE = () => (
  <ErrorBoundary componentName="ButtonDownloadOrder">
    <ButtonDownloadOrder />
  </ErrorBoundary>
)

export const OrderPDF = () => {
  const { order, customer, payments } = useOrderDetails()
  const { categories } = useStore()
  const { toPDF, targetRef } = usePDF({
    filename: `orden-${order?.folio}-${customer.name.split(' ').join('-')}.pdf`,
    page: {
      format: [120, 200],
      orientation: 'portrait',
      margin: 2
    },
    canvas: {
      mimeType: 'image/png',
      qualityRatio: 1
    }
    //   method: 'open'
  })

  console.log({
    items: order.items,
    createdAt: order?.createdAt,
    delivederd: order?.deliveredAt
  })
  const printedAt = new Date()

  return (
    <>
      <View
        ref={targetRef}
        style={{
          padding: 10,
          width: '100%',
          maxWidth: 'auto', // Ancho estándar A4 en px (72dpi)
          alignSelf: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          margin: 'auto'
        }}
      >
        {/* Header */}
        <View
          style={{
            alignItems: 'center',
            marginBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
            paddingBottom: 15,
            width: '100%'
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#003366',
              marginBottom: 5,
              textAlign: 'center'
            }}
          >
            Orden # {order?.folio}
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#003366',
              marginBottom: 5,
              textAlign: 'center'
            }}
          >
            Tipo: {dictionary(order.type)}
          </Text>
          {!!order?.repairingAt && (
            <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
              Fecha de inicio:{' '}
              {dateFormat(asDate(order?.repairingAt), 'EE dd/MMM/yy HH:mm')}
            </Text>
          )}
          {!!order?.createdAt && (
            <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
              Creada:{' '}
              {dateFormat(asDate(order?.createdAt), 'EE dd/MMM/yy HH:mm')}
            </Text>
          )}
          {!!printedAt && (
            <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
              Impresa: {dateFormat(asDate(printedAt), 'EE dd/MMM/yy HH:mm')}
            </Text>
          )}
          {!!order?.deliveredAt && (
            <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
              Fecha de entrega:{' '}
              {dateFormat(asDate(order?.deliveredAt), 'EE dd/MMM/yy HH:mm')}
            </Text>
          )}
        </View>

        {/* Client Information */}
        <View style={{ marginBottom: 20, width: '100%' }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 10,
              color: '#444'
            }}
          >
            Información del Cliente
          </Text>
          <View
            style={{
              backgroundColor: '#f8f8f8',
              padding: 15,
              borderRadius: 5,
              width: '100%'
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 5 }}>
              Nombre: {order?.fullName || 'N/A'}
            </Text>
            <Text style={[{ fontSize: 12, marginBottom: 5 }, gStyles.tBold]}>
              Contactos
            </Text>
            {Object.entries(customer?.contacts || {}).map(([key, value]) => (
              <Text key={key} style={{ fontSize: 16, marginBottom: 5 }}>
                {value.label}: {value.value}
              </Text>
            ))}
          </View>
        </View>

        {/* Order Details */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            color: '#444',
            width: '100%'
          }}
        >
          Detalles de la Orden
        </Text>

        {/* Status y Nota */}
        <View
          style={{
            backgroundColor: '#f8f8f8',
            padding: 15,
            borderRadius: 5,
            marginBottom: 15,
            width: '100%'
          }}
        >
          <Text style={{ fontSize: 16, marginBottom: 5 }}>
            Estado: {dictionary(order?.status) || 'N/A'}
          </Text>
          {!!order?.note && (
            <Text style={{ fontSize: 16, marginBottom: 5 }}>
              Nota: {order.note}
            </Text>
          )}
          {!!order?.expireAt && (
            <Text style={{ fontSize: 16, marginBottom: 5 }}>
              Vence: {dateFormat(asDate(order.expireAt), 'EE dd/MMM/yy HH:mm')}
            </Text>
          )}
        </View>

        {order.type === order_type.REPAIR && (
          <>
            <Text style={{ width: '100%' }}>Cotización:</Text>
            {/*
  //@ts-ignore  */}
            {order?.quotes?.map((item) => (
              <View
                key={item?.id}
                style={{
                  backgroundColor: '#f8f8f8',
                  padding: 15,
                  borderRadius: 5,
                  marginBottom: 10,
                  width: '100%'
                }}
              >
                <Text style={{ fontSize: 16, marginBottom: 5 }}>
                  Producto: {item.description}
                </Text>
                <Text style={{ fontSize: 16, marginBottom: 5 }}>
                  Precio: <CurrencyAmount amount={item.amount} />
                </Text>
              </View>
            ))}
          </>
        )}
        {order.type === order_type.SALE && (
          <View style={{ width: '100%' }}>
            <Text
              style={{ width: '100%', fontWeight: 'bold', marginBottom: 10 }}
            >
              Productos:
            </Text>
            {order?.items?.map((item, index) => {
              const saleItem = item as any
              const itemPrice =
                saleItem.priceSelected?.amount || saleItem.price || 0
              const itemQty = saleItem.quantity || saleItem.priceQty || 1
              const brand = saleItem.brand || ''
              const category =
                categories.find((c) => c.id === saleItem.category).name || ''

              return (
                <View
                  key={saleItem?.id || index}
                  style={{
                    backgroundColor: '#f8f8f8',
                    padding: 15,
                    borderRadius: 5,
                    marginBottom: 10,
                    width: '100%'
                  }}
                >
                  <Text style={{ fontSize: 16, marginBottom: 5 }}>
                    Producto: {category}
                  </Text>
                  <Text style={{ fontSize: 16, marginBottom: 5 }}>
                    Marca: {brand}
                  </Text>
                  <Text style={{ fontSize: 16, marginBottom: 5 }}>
                    Cantidad: {itemQty}
                  </Text>
                  {!!saleItem.serial && (
                    <Text style={{ fontSize: 16, marginBottom: 5 }}>
                      Serie: {saleItem.serial}
                    </Text>
                  )}
                  <Text style={{ fontSize: 16, marginBottom: 5 }}>
                    Precio Unitario: <CurrencyAmount amount={itemPrice} />
                  </Text>
                  <Text style={{ fontSize: 16, marginBottom: 5 }}>
                    Total: <CurrencyAmount amount={itemPrice * itemQty} />
                  </Text>
                  {saleItem.guaranteeMonths && (
                    <View>
                      <Text style={{ fontSize: 16, marginBottom: 5 }}>
                        Este producto cuenta con una Garantía de{' '}
                        <Text style={gStyles.tBold}>
                          {saleItem.guaranteeMonths}
                        </Text>{' '}
                        meses.
                      </Text>
                    </View>
                  )}
                </View>
              )
            })}
            {/* Total de venta */}
            <View
              style={{
                backgroundColor: '#003366',
                padding: 15,
                borderRadius: 5,
                marginTop: 5,
                width: '100%'
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}
              >
                Total:{' '}
                <CurrencyAmount
                  style={{ color: 'white' }}
                  amount={order?.items?.reduce((acc, item) => {
                    const saleItem = item as any
                    const itemPrice =
                      saleItem.priceSelected?.amount || saleItem.price || 0
                    const itemQty = saleItem.quantity || saleItem.priceQty || 1
                    return acc + itemPrice * itemQty
                  }, 0)}
                />
              </Text>
            </View>
          </View>
        )}

        {/* Sección de Pagos */}
        <View style={{ width: '100%', marginTop: 20, marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 10,
              color: '#444',
              width: '100%'
            }}
          >
            Pagos ({payments?.length || 0})
          </Text>
          {payments && payments.length > 0 ? (
            <>
              {payments
                .filter((p: PaymentType) => !p.canceled)
                .map((payment: PaymentType) => (
                  <View
                    key={payment.id}
                    style={{
                      backgroundColor: '#f8f8f8',
                      padding: 15,
                      borderRadius: 5,
                      marginBottom: 10,
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap'
                    }}
                  >
                    <View style={{ flex: 1, minWidth: 150 }}>
                      <Text style={{ fontSize: 14, marginBottom: 3 }}>
                        {dateFormat(
                          asDate(payment.createdAt),
                          'dd/MMM/yy HH:mm'
                        )}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#666' }}>
                        {dictionary(payment.method)}
                      </Text>
                    </View>
                    <CurrencyAmount
                      style={{ fontSize: 16, fontWeight: 'bold' }}
                      amount={payment.amount}
                    />
                  </View>
                ))}
              {/* Total de pagos */}
              <View
                style={{
                  backgroundColor: '#28a745',
                  padding: 15,
                  borderRadius: 5,
                  marginTop: 5,
                  width: '100%'
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}
                >
                  Total Pagado:{' '}
                  <CurrencyAmount
                    style={{ color: 'white' }}
                    amount={payments
                      .filter((p: PaymentType) => !p.canceled)
                      .reduce(
                        (acc: number, p: PaymentType) => acc + (p.amount || 0),
                        0
                      )}
                  />
                </Text>
              </View>
            </>
          ) : (
            <View
              style={{
                backgroundColor: '#f8f8f8',
                padding: 15,
                borderRadius: 5,
                width: '100%'
              }}
            >
              <Text
                style={{
                  fontStyle: 'italic',
                  textAlign: 'center',
                  color: '#666'
                }}
              >
                No hay pagos registrados
              </Text>
            </View>
          )}
        </View>
        {/* Sección de imágenes con título */}

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 10,
              color: '#444',
              width: '100%'
            }}
          >
            Imágenes del pedido
          </Text>

          <View
            style={{
              backgroundColor: '#f8f8f8',
              padding: 15,
              borderRadius: 5,
              width: '100%',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between' // Mejor distribución
            }}
          >
            {Object.entries(order.orderImages || {}).length === 0 ? (
              <Text
                style={{
                  fontStyle: 'italic',
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                No hay imágenes disponibles
              </Text>
            ) : (
              Object.entries(order.orderImages || {}).map(([key, value]) => (
                <View
                  key={key}
                  style={{
                    width: '47%', // Dos imágenes por fila con espacio entre ellas
                    marginBottom: 20,
                    backgroundColor: 'white',
                    borderRadius: 5,
                    padding: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    alignItems: 'center'
                  }}
                >
                  <Image
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 5,
                      marginBottom: 8
                    }}
                    source={{ uri: value.src }}
                    resizeMode="cover"
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '500',
                      textAlign: 'center',
                      marginTop: 4,
                      color: '#444'
                    }}
                  >
                    {value?.description || 'Sin descripción'}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
        {/* Firma de aceptación y enlace de contrato */}
        <View style={{ width: '100%', alignItems: 'center' }}>
          {order?.contractSignature?.accept ? (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>Aceptada ✅</Text>
              <Image
                source={{ uri: order?.contractSignature?.signature }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 10,
                  marginVertical: 10
                }}
                resizeMode="contain"
              />
            </View>
          ) : (
            <Text style={{ fontSize: 16, marginBottom: 5 }}>Sin firma</Text>
          )}
        </View>
      </View>

      <Button
        onPress={toPDF}
        label="Descargar PDF"
        icon="download"
        fullWidth={true}
      />
      {/* <Button
        onPress={() => {
          generatePDF(targetRef, {
            filename: `orden-${order?.folio}-${customer.name
              .split(' ')
              .join('-')}.pdf`,
            page: {
              format: [120, 200],
              orientation: 'portrait',
              margin: 2
            },
            canvas: {
              mimeType: 'image/png',
              qualityRatio: 1
            },
            method: 'save'

            // Esto retorna un blob
          }).then((res) => {
            const pdfBlob = res.output('blob')
            console.log({ pdfBlob })
          })
        }}
        label="Enviar WS"
        icon="whatsapp"
        color="success"
        fullWidth={true}
      /> */}
    </>
  )
}
