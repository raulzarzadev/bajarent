import { View, Text, Pressable } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import List from '../List'
import { useCurrentWork } from '../../state/features/currentWork/currentWorkSlice'
import { CurrentWorkUpdate } from './CurrentWorkType'
import asDate, { dateFormat } from '../../libs/utils-date'
import { useEmployee } from '../../contexts/employeeContext'
import { gStyles } from '../../styles'
import Icon from '../Icon'
import useMyNav from '../../hooks/useMyNav'
import theme from '../../theme'
const CurrentWorkList = (props?: CurrentWorkListProps) => {
  const { data } = useCurrentWork()
  const { toOrders, toPayments } = useMyNav()
  console.log({ data })
  const {
    permissions: { isAdmin }
  } = useEmployee()
  const currentWorks: CurrentWorkUpdate[] = Object.entries(
    data?.updates || {}
  ).map(([id, value]) => ({ id, ...value }))
  if (!isAdmin) return null
  if (currentWorks?.length === 0) return null
  return (
    <View>
      <Text style={gStyles.h2}>Trabajo actual</Text>
      <List
        data={currentWorks}
        sortFields={[
          {
            key: 'createdAt',
            label: 'Fecha'
          }
        ]}
        defaultSortBy="createdAt"
        defaultOrder="des"
        ComponentRow={({ item }) => {
          return (
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ marginRight: 6 }}>
                {dateFormat(asDate(item.createdAt), 'dd/MM/yy HH:mm:sss')}
              </Text>
              <Text style={{ marginRight: 6 }}>{item.type}</Text>
              <Text style={{ marginRight: 6 }}>{item.action}</Text>
              {item?.type === 'order' && (
                <Pressable
                  onPress={() => toOrders({ id: item?.details?.orderId })}
                >
                  <Icon icon="openEye" size={12} color={theme.primary} />
                </Pressable>
              )}
              {item?.type === 'payment' && (
                <Pressable
                  onPress={() => toPayments({ id: item?.details?.paymentId })}
                >
                  <Icon icon="openEye" size={12} color={theme.primary} />
                </Pressable>
              )}
            </View>
          )
        }}
      ></List>
    </View>
  )
}
export default CurrentWorkList
export type CurrentWorkListProps = {}
export const CurrentWorkListE = (props: CurrentWorkListProps) => (
  <ErrorBoundary componentName="CurrentWorkList">
    <CurrentWorkList {...props} />
  </ErrorBoundary>
)
