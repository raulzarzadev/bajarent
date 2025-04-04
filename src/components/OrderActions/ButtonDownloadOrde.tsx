import { View, Text, Image } from 'react-native'
import Button from '../Button'
import ErrorBoundary from '../ErrorBoundary'
// Corregir la importación de RNHTMLtoPDF
import { Alert, Share, Platform } from 'react-native'
import { useOrderDetails } from '../../contexts/orderContext'
import OrderType, { order_type } from '../../types/OrderType'
import { usePDF } from 'react-to-pdf'
import StyledModal from '../StyledModal'
import useModal from '../../hooks/useModal'
import asDate, { dateFormat } from '../../libs/utils-date'
import dictionary from '../../dictionary'
import CurrencyAmount from '../CurrencyAmount'
import { gStyles } from '../../styles'

// Función para mostrar opciones de acción
const showActionOptions = async (options: string[]): Promise<string> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Selecciona una opción',
      'Elige qué hacer con el documento',
      options.map((option) => ({
        text: option,
        onPress: () => resolve(option)
      })),
      { cancelable: true, onDismiss: () => resolve('') }
    )
  })
}

// Función para descargar el archivo
const downloadFile = async (filePath: string): Promise<void> => {
  try {
    // En dispositivos móviles, esto generalmente implica guardar en el almacenamiento
    Alert.alert(
      'Documento Guardado',
      `El documento se ha guardado en: ${filePath}`
    )
  } catch (error) {
    console.error('Error al descargar el archivo:', error)
    throw new Error('No se pudo descargar el archivo')
  }
}

// Función para enviar por email
const sendOrderByEmail = async (
  filePath: string,
  customerEmail?: string
): Promise<void> => {
  try {
    if (!customerEmail) {
      throw new Error('Email del cliente no proporcionado')
    }

    // En una implementación real, esto podría enviar el archivo a través de una API
    // Por ahora, usamos la función Share para simular la compartición
    await Share.share({
      title: 'Orden PDF',
      message: `Tu orden ha sido procesada. Enviando a: ${customerEmail}`,
      url: `file://${filePath}`
    })
  } catch (error) {
    console.error('Error al enviar email:', error)
    throw new Error('No se pudo enviar el email')
  }
}

const ButtonDownloadOrder = (props?: ButtonDownloadOrderProps) => {
  const modal = useModal({ title: 'Descargar PDF' })
  return (
    <View>
      <Button
        size="small"
        fullWidth={true}
        variant="outline"
        label="Descargar"
        icon="download"
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
export type ButtonDownloadOrderProps = {
  order: Partial<OrderType>
}
export const ButtonDownloadOrderE = (props: ButtonDownloadOrderProps) => (
  <ErrorBoundary componentName="ButtonDownloadOrder">
    <ButtonDownloadOrder {...props} />
  </ErrorBoundary>
)

export const OrderPDF = () => {
  const { order, customer } = useOrderDetails()
  const { toPDF, targetRef } = usePDF({
    filename: `orden-${order?.folio}-${customer.name}.pdf`,
    page: {
      format: [120, 200],
      orientation: 'portrait',
      margin: 2
    },
    canvas: {
      mimeType: 'image/png',
      qualityRatio: 1
    },
    method: 'open'
  })

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
            {Object.entries(customer.contacts).map(([key, value]) => (
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
        {order.type === order_type.REPAIR && (
          <>
            <Text style={{ width: '100%' }}>Cotización:</Text>
            {order?.quotes?.map((item, index) => (
              <View
                key={index}
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
          {order.contractSignature.accept ? (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>Aceptada ✅</Text>
              <Image
                source={{ uri: order.contractSignature.signature }}
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
            <Text style={{ fontSize: 16, marginBottom: 5 }}>
              No aceptada ❌
            </Text>
          )}
        </View>
      </View>

      <Button onPress={toPDF} label="Descargar PDF" fullWidth={true} />
    </>
  )
}
