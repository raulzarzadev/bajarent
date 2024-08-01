import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button from './Button'
import { useStore } from '../contexts/storeContext'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { where } from 'firebase/firestore'
import { json2csv } from 'json-2-csv'
import asDate, { dateFormat } from '../libs/utils-date'
import OrderType, { order_type } from '../types/OrderType'
import { getUserName } from './SpanUser'
import { currentRentPeriod } from '../libs/orders'
import dictionary from '../dictionary'

const ButtonDownloadCSV = () => {
  const { storeId, staff } = useStore()
  const modal = useModal({ title: 'Descargar CSV' })

  const handleDownloadRents = () => {
    ServiceOrders.findMany([
      where('storeId', '==', storeId),
      where('type', '==', 'RENT'),
      where('status', '==', 'DELIVERED')
    ]).then((rents) => {
      const res = json2csv(formatRentsToCSV(rents, staff))
      downloadLink({ res, fileName: 'rentas-activas' })
    })
  }
  const handleDownloadAllRents = () => {
    ServiceOrders.findMany([
      where('storeId', '==', storeId),
      where('type', '==', 'RENT')
    ]).then((rents) => {
      const res = json2csv(formatRentsToCSV(rents, staff))
      downloadLink({ res, fileName: 'todas-las-rentas' })
    })
  }
  const handleDownloadRepairs = () => {
    ServiceOrders.findMany([
      where('storeId', '==', storeId),
      where('type', '==', order_type.REPAIR)
    ]).then((rents) => {
      const res = json2csv(formatRentsToCSV(rents, staff))
      downloadLink({ res, fileName: 'reparaciones' })
    })
  }
  return (
    <View>
      <Button
        label="Descargar"
        icon="download"
        onPress={() => {
          modal.toggleOpen()
        }}
      />
      <StyledModal {...modal}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            flexWrap: 'wrap'
          }}
        >
          <Button
            buttonStyles={{ margin: 10 }}
            label="Rentas activas ⏰"
            onPress={() => {
              handleDownloadRents()
            }}
          ></Button>
          <Button
            buttonStyles={{ margin: 10 }}
            label="Todas las rentas ⏰"
            onPress={() => {
              handleDownloadAllRents()
            }}
          ></Button>
          <Button
            buttonStyles={{ margin: 10 }}
            label="Reparaciónes ⏰"
            onPress={() => {
              handleDownloadRepairs()
            }}
          ></Button>
        </View>
      </StyledModal>
    </View>
  )
}
const downloadLink = ({ res, fileName = 'download' }) => {
  // Convertir la cadena CSV en un Blob
  const csvBlob = new Blob([res], { type: 'text/csv;charset=utf-8;' })

  // Crear un URL para el Blob
  const csvUrl = URL.createObjectURL(csvBlob)

  // Crear un elemento <a> temporal para simular un clic de descarga
  const downloadLink = document.createElement('a')
  downloadLink.href = csvUrl
  downloadLink.setAttribute('download', `${fileName}.csv`) // Nombre del archivo a descargar
  document.body.appendChild(downloadLink) // Necesario para que funcione en Firefox
  downloadLink.click()
  document.body.removeChild(downloadLink) // Limpiar el DOM
  // aqui deberia mostrar un prompt en la pantalla para descargar el archivo
}

const formatRentsToCSV = (rents, staff) => {
  const formatDate = (date) =>
    date ? dateFormat(asDate(date), 'yyyy-MM-dd HH:mm:ss') : ''
  const formatUser = (userId) => getUserName(staff, userId) || ''
  return rents.map((rent: Partial<OrderType>) => {
    return {
      type: dictionary(rent?.type) || '',
      status: dictionary(rent?.status) || '',
      folio: rent?.folio || '',
      note: rent?.note || '',
      fullName: rent?.fullName || '',
      //email: rent?.email || '',
      phone: rent?.phone || '',
      street: rent?.street || '',
      neighborhood: rent?.neighborhood || '',
      location: rent?.location || '',
      time: currentRentPeriod(rent) || '',
      // items:
      //   rent?.items?.map((item) => item.categoryName).join(', ') ||
      //   '' ||
      //   '',
      deliveredAt: formatDate(rent.deliveredAt) || '',
      expireAt: formatDate(rent.expireAt) || '',
      // pickedUpAt: formatDate(rent.pickedUpAt) || '',
      // pickedUpBy: formatUser(rent.pickedUpBy) || '',
      deliveredBy: formatUser(rent.deliveredBy) || '',
      createdBy: formatUser(rent.createdBy) || '',
      createdAt: formatDate(rent.createdAt) || ''
    }
  })
}

export default ButtonDownloadCSV

const styles = StyleSheet.create({})
