import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import { useState } from 'react'
import { gStyles } from '../../styles'
import Button from '../Button'
const CustomersActions = (props?: CustomersActionsProps) => {
  const ids = props?.ids
  const { remove } = useCustomers()
  const [disabled, setDisabled] = useState(false)
  const handleDeleteCustomers = async (ids) => {
    setDisabled(true)
    const promises = ids.map((id) => remove(id))
    await Promise.all(promises).catch((err) => {
      console.error(err)
    })
    setDisabled(false)
  }
  return (
    <View>
      <Text style={gStyles.h2}>Clientes seleccionados {ids?.length}</Text>
      <Text style={gStyles.h3}>{disabled && 'Eliminando...'}</Text>
      <Button
        disabled={disabled}
        label="Eliminar "
        color="error"
        onPress={async () => {
          handleDeleteCustomers(ids)
        }}
      />
    </View>
  )
}

export default CustomersActions
export type CustomersActionsProps = {
  ids: string[]
}
export const CustomersActionsE = (props: CustomersActionsProps) => (
  <ErrorBoundary componentName="CustomersActions">
    <CustomersActions {...props} />
  </ErrorBoundary>
)
