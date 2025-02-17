import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import List from '../List'
import { useCurrentWork } from '../../state/features/currentWork/currentWorkSlice'
const CurrentWorkList = (props?: CurrentWorkListProps) => {
  const { data } = useCurrentWork()
  console.log({ data })
  return null
  return (
    <View>
      <Text>Trabajo actual</Text>
      <List
        data={[]}
        ComponentRow={({ item }) => {
          return (
            <View>
              <Text>{item.storeId}</Text>
              <Text>{item.date}</Text>
              <Text>{item.updates}</Text>
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
