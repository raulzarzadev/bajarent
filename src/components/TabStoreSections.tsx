import { View } from 'react-native'
import Tabs, { TabType } from './Tabs'
import { useStore } from '../contexts/storeContext'
import { SectionDetailsE } from './SectionDetails'
import useMyNav from '../hooks/useMyNav'
import { store_section_icons } from '../types/SectionType'

const TabStoreSections = () => {
  const { sections: storeSections } = useStore()
  const { toSections } = useMyNav()
  const sections: TabType[] = storeSections
    .sort(sortSectionsByType)
    ?.map((section) => ({
      content: (
        <View style={{ marginTop: 16 }}>
          <SectionDetailsE section={section} />
        </View>
      ),
      title: section.name,
      icon: store_section_icons[section.type],
      show: true
    }))

  return (
    <Tabs
      tabs={sections}
      showAddTab
      handlePressAdd={() => toSections({ screenNew: true })}
      addTabTitle="Nueva sección"
    />
  )
}

export default TabStoreSections

const sortSectionsByType = (a, b) => {
  const typeOrder = {
    workshop: 1,
    delivery: 2,
    storage: 3
  }

  // Get the order value or use a large number for any unspecified types
  const orderA = typeOrder[a.type] || 999
  const orderB = typeOrder[b.type] || 999

  return orderA - orderB
}
