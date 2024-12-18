import { View } from 'react-native'
import Tabs, { TabType } from './Tabs'
import { useStore } from '../contexts/storeContext'
import { SectionDetailsE } from './SectionDetails'

const TabStoreSections = () => {
  const { sections: storeSections } = useStore()

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
    <View style={{ marginTop: 16 }}>
      <Tabs tabs={sections} />
    </View>
  )
}

export default TabStoreSections
