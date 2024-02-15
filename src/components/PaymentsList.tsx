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
    { key: 'date', label: 'Fecha' },
    { key: 'amount', label: 'Cantidad' },
    { key: 'method', label: 'Método' }
  ]

  return (
    <List
      data={payments}
      ComponentRow={PaymentRow}
      sortFields={sortFields}
      defaultSortBy="date"
      defaultOrder="des"
      onPressRow={(id) => {
        onPressRow?.(id)
        console.log({ id })
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
