import { View } from 'react-native'
import Tabs, { TabType } from './Tabs'
import { useStore } from '../contexts/storeContext'
import { SectionDetailsE } from './SectionDetails'
import useMyNav from '../hooks/useMyNav'

const TabStoreSections = () => {
  const { sections: storeSections } = useStore()
  const { toSections } = useMyNav()
  const sections: TabType[] = storeSections?.map((section) => ({
    content: (
      <View style={{ marginTop: 16 }}>
        <SectionDetailsE section={section} />
      </View>
    ),
    title: section.name,
    icon: section?.icon,

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
