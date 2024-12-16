import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { StoreBalanceType } from '../../types/StoreBalance'
import { useStore } from '../../contexts/storeContext'
import { gStyles } from '../../styles'
import { ExpandibleListE } from '../ExpandibleList'
import useMyNav from '../../hooks/useMyNav'
const SectionBalanceRentItems = ({ items }: SectionBalanceRentItemsProps) => {
  const { storeSections, categories } = useStore()
  const { toItems } = useMyNav()
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.assignedSection]) acc[item.assignedSection] = []
    acc[item.assignedSection].push(item)
    return acc
  }, {} as { [key: string]: StoreBalanceType['items'] })
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        {Object.entries(groupedItems).map(([sectionId, items]) => {
          return (
            <View key={sectionId}>
              <ExpandibleListE
                label={`${
                  storeSections.find((section) => section.id === sectionId)
                    ?.name || 'Sin asignar'
                }`}
                items={(items || [])
                  .sort((a, b) => (b.itemEco > a.itemEco ? -1 : 1))
                  .map((item) => {
                    return {
                      id: item.itemId,
                      content: (
                        <Text>
                          {item.itemEco} {item.categoryName}
                        </Text>
                      )
                    }
                  })}
                onPressRow={(id) => toItems({ id })}
              />

              {/* <Text>
              {storeSections.find((section) => section.id === sectionId)?.name}
              <Text style={gStyles.tBold}></Text>
              </Text>
              {groupedItems[sectionId].map((item) => (
                <Text key={item.itemId}>{item.itemEco}</Text>
                ))} */}
            </View>
          )
        })}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <ExpandibleListE
          label={`Todas`}
          items={(items || [])
            .sort((a, b) => (b.itemEco > a.itemEco ? -1 : 1))
            .map((item) => {
              return {
                id: item.itemId,
                content: (
                  <Text>
                    {item.itemEco} {item.categoryName}
                  </Text>
                )
              }
            })}
          onPressRow={(id) => toItems({ id })}
        />
      </View>
    </View>
  )
}
export type SectionBalanceRentItemsProps = {
  items: StoreBalanceType['items']
}
export const SectionBalanceRentItemsE = (
  props: SectionBalanceRentItemsProps
) => (
  <ErrorBoundary componentName="SectionBalanceRentItems">
    <SectionBalanceRentItems {...props} />
  </ErrorBoundary>
)
export default SectionBalanceRentItemsE
