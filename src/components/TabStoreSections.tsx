import { useStore } from '../contexts/storeContext'
import useMyNav from '../hooks/useMyNav'
import { store_section_icons } from '../types/SectionType'
import { SectionDetailsE } from './SectionDetails'
import Tabs, { type TabType } from './Tabs'

const TabStoreSections = () => {
  const { sections: storeSections } = useStore()
  const { toSections } = useMyNav()
  const sections: TabType[] = storeSections
    ?.sort(sortSectionsByType)
    ?.map((section) => ({
      content: <SectionDetailsE section={section} />,
      title: `${section.name} `,
      icon: store_section_icons[section.type],
      show: true
    }))

  return (
    <Tabs
      tabId="store-sections"
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
