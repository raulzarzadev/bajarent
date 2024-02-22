import PaymentType from '../types/PaymentType'
import List from './List'
import PaymentRow from './PaymentRow'

function PaymentsList({
  payments,
  onPressRow
}: {
  payments: PaymentType[]
  onPressRow?: (paymentId: string) => void
}) {
  const sortFields = [
    { key: 'orderFolio', label: 'Folio' },
    { key: 'date', label: 'Fecha' },
    { key: 'amount', label: 'Cantidad' },
    { key: 'method', label: 'Método' },
    { key: 'reference', label: 'Referencia' }
  ]

  return (
    <List
      data={payments}
      ComponentRow={PaymentRow}
      sortFields={sortFields}
      defaultSortBy="date"
      defaultOrder="asc"
      onPressRow={(id) => {
        onPressRow?.(id)
      }}
      filters={[
        // {
        //   field: 'date',
        //   label: 'Fecha'
        // },
        {
          field: 'method',
          label: 'Método'
        }
      ]}
    />
  )
}

export default PaymentsList