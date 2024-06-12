import { useStore } from '../contexts/storeContext'
import PaymentType from '../types/PaymentType'
import { LoadingList } from './List'
import PaymentRow from './PaymentRow'

export type PaymentTypeList = PaymentType & { createdByName?: string }
function ListPayments({
  payments,
  onPressRow,
  onFetchMore
}: {
  payments: PaymentTypeList[]
  onPressRow?: (paymentId: string) => void
  onFetchMore?: () => void
}) {
  const sortFields = [
    { key: 'orderFolio', label: 'Folio' },
    { key: 'date', label: 'Fecha' },
    { key: 'amount', label: 'Cantidad' },
    { key: 'method', label: 'Método' },
    { key: 'reference', label: 'Referencia' },
    { key: 'createdByName', label: 'Creado por' }
  ]
  const { staff } = useStore()
  return (
    <LoadingList
      data={payments.map((payment) => {
        payment.amount = parseFloat(`${payment.amount || 0}`) || 0
        payment.createdByName =
          staff.find((s) => s.userId === payment.createdBy)?.name ||
          'sin nombre'
        return payment
      })}
      ComponentRow={PaymentRow}
      sortFields={sortFields}
      defaultSortBy="date"
      defaultOrder="des"
      onPressRow={(id) => {
        onPressRow?.(id)
      }}
      filters={[
        // {
        //   field: 'date',
        //   label: 'Fecha'
        // },
        {
          field: 'createdByName',
          label: 'Creado por'
        },
        {
          field: 'method',
          label: 'Método'
        }
      ]}
      onFetchMore={onFetchMore}
    />
  )
}

export default ListPayments
