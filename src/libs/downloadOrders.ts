import { where } from 'firebase/firestore'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { json2csv } from 'json-2-csv'
import { currentRentPeriod } from './orders'
import asDate, { dateFormat } from './utils-date'
import { getUserName } from '../components/SpanUser'
import OrderType, { ContactType } from '../types/OrderType'
import dictionary from '../dictionary'
import StoreType from '../types/StoreType'
import { ServiceBalances } from '../firebase/ServiceBalances2'
import JSZip from 'jszip'

export const rentsCSVFile = async ({
  storeId,
  storeStaff,
  type = 'in-rent'
}: {
  storeId: string
  storeStaff: StoreType['staff']
  type: 'in-rent' | 'all-rents'
}) => {
  let filters = []
  if (type === 'in-rent') {
    filters = [where('type', '==', 'RENT'), where('status', '==', 'DELIVERED')]
  }
  if (type === 'all-rents') {
    filters = [where('type', '==', 'RENT')]
  }

  const jsonRes = await ServiceOrders.findMany([
    where('storeId', '==', storeId),
    ...filters
  ]).catch((error) => {
    console.log('error', error)
  })
  return json2csv(formatRentsToCSV(jsonRes, storeStaff))
}
export const balanceJSONFile = async ({ storeId }) => {
  const jsonRes = await getDateBalance({
    storeId,
    fromDate: new Date(),
    toDate: new Date(),
    storeSections: []
  })

  return jsonRes
}

export const onDownloadBackup = async ({ storeId, storeStaff, storeName }) => {
  const rentsPromise = rentsCSVFile({
    storeId,
    storeStaff,
    type: 'all-rents'
  })
  const balancePromise = balanceJSONFile({
    storeId
  })

  return await Promise.all([rentsPromise, balancePromise])
    .then(([rentsData, balanceData]) => {
      if (!rentsData || !balanceData) {
        throw new Error('Error downloading data')
      }
      const zip = new JSZip()
      zip.file(`orders-${dateFormat(new Date(), 'ddMMMyy')}.csv`, rentsData)
      zip.file(
        `balance-${dateFormat(new Date(), 'ddMMMyy')}.json`,
        JSON.stringify(balanceData)
      )

      zip.generateAsync({ type: 'blob' }).then((content) => {
        const downloadLink = document.createElement('a')
        downloadLink.href = URL.createObjectURL(content)
        downloadLink.setAttribute(
          'download',
          `${storeName}-${dateFormat(new Date(), 'ddMMMyy')}.zip`
        )
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      })
    })
    .catch((error) => {
      console.log('error', error)
    })
}

export const getDateBalance = async ({
  storeId,
  fromDate,
  toDate,
  storeSections
}) => {
  return await ServiceBalances.createV2(storeId, {
    fromDate,
    toDate,
    notSave: true,
    storeSections
  }).catch((e) => console.error(e))
}

export const formatRentsToCSV = (rents, storeStaff: StoreType['staff']) => {
  const formatDate = (date) =>
    date ? dateFormat(asDate(date), 'yyyy-MM-dd HH:mm:ss') : ''
  const formatUser = (userId) => getUserName(storeStaff, userId) || ''
  return rents.map((rent: Partial<OrderType>) => {
    const contacts = (rent?.contacts as ContactType[]) || []
    return {
      type: dictionary(rent?.type) || '',
      status: dictionary(rent?.status) || '',
      folio: rent?.folio || '',
      note: rent?.note || '',
      items:
        rent?.items
          ?.map((item) => `${item?.number || ''} ${item?.serial || ''}`)
          .join(', ') ||
        '' ||
        '',
      fullName: rent?.fullName || '',
      //email: rent?.email || '',
      phone:
        `${rent?.phone} ${contacts?.length > 0 ? ', ' : ''}${contacts
          ?.map((c) => `${c?.phone || ''}`)
          .join(', ')}` || '',
      address: rent?.address || '',
      neighborhood: rent?.neighborhood || '',
      coords: rent?.coords || '',
      time: currentRentPeriod(rent) || '',

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
