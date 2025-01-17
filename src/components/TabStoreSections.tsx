import { View } from 'react-native'
import Tabs, { TabType } from './Tabs'
import { useStore } from '../contexts/storeContext'
import { SectionDetailsE } from './SectionDetails'
import Button from './Button'
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
    <View style={{ marginTop: 0 }}>
      <Button
        label="Agregar area"
        onPress={() => toSections({ screenNew: true })}
        fullWidth={false}
        buttonStyles={{ marginHorizontal: 'auto', marginVertical: 16 }}
        size="xs"
        icon="add"
      />
      <Tabs tabs={sections} />
    </View>
  )
}

export default TabStoreSections
