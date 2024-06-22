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
import OrderType from '../types/OrderType'
import { getUserName } from './SpanUser'
import { pick } from 'cypress/types/lodash'
import { currentRentPeriod } from '../libs/orders'

const ButtonDownloadCSV = () => {
  const { storeId, staff } = useStore()
  const modal = useModal({ title: 'Descargar CSV' })

  const handleDownloadRents = () => {
    ServiceOrders.findMany([
      where('storeId', '==', storeId),
      where('type', '==', 'RENT'),
      where('status', '==', 'DELIVERED')
    ]).then((rents) => {
      console.log({ rents })
      const formatRentsToCSV = (rents) => {
        const formatDate = (date) =>
          date ? dateFormat(asDate(date), 'yyyy-MM-dd HH:mm:ss') : ''
        const formatUser = (userId) => getUserName(staff, userId) || ''
        return rents.map((rent: Partial<OrderType>) => {
          return {
            folio: rent?.folio || '',
            note: rent?.note || '',
            fullName: rent?.fullName || '',
            // status: rent?.status || '',
            //type: rent?.type || '',
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
      const res = json2csv(formatRentsToCSV(rents))

      // Convertir la cadena CSV en un Blob
      const csvBlob = new Blob([res], { type: 'text/csv;charset=utf-8;' })

      // Crear un URL para el Blob
      const csvUrl = URL.createObjectURL(csvBlob)

      // Crear un elemento <a> temporal para simular un clic de descarga
      const downloadLink = document.createElement('a')
      downloadLink.href = csvUrl
      downloadLink.setAttribute('download', 'rents.csv') // Nombre del archivo a descargar
      document.body.appendChild(downloadLink) // Necesario para que funcione en Firefox
      downloadLink.click()
      document.body.removeChild(downloadLink) // Limpiar el DOM
      // aqui deberia mostrar un prompt en la pantalla para descargar el archivo
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
        <Button
          label="Rentas ⏰"
          onPress={() => {
            console.log('rentas')
            handleDownloadRents()
          }}
        ></Button>
      </StyledModal>
    </View>
  )
}

export default ButtonDownloadCSV

const styles = StyleSheet.create({})
