import { useEffect, useState } from 'react'
import { useStore } from '../../contexts/storeContext'
import useModal from '../../hooks/useModal'
import asDate, { dateFormat } from '../../libs/utils-date'
import Button from '../Button'
import { Event } from '../Calendars/WeekTimeline2'
import InputSelect from '../InputSelect'
import StyledModal from '../StyledModal'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import WeekOrdersTimeLine from '../WeekOrdersTimeLine'
import OrderType from '../../types/OrderType'
import { Text, View } from 'react-native'
import { gStyles } from '../../styles'

const ModalAssignOrder = ({
  orderId = null,
  assignDate,
  assignSection,
  section,
  date
}: {
  orderId: string | null
  assignDate?: (value: Date | null) => void
  assignSection?: (value: string | null) => void
  section?: string
  date?: Date
}) => {
  const { storeSections, orders } = useStore()
  const order = orders.find((o) => o.id === orderId)
  const assignedToSection = order?.assignToSection || section
  const assignedDate = order?.scheduledAt || date
  const modal = useModal({ title: 'Asignar a' })
  const sectionAssigned = storeSections.find(
    (o) => o?.id === assignedToSection
  )?.name

  // const [sectionEvents, setSectionEvents] = useState<Event[]>([])

  const handleChangeAssignSection = (sectionId: string) => {
    assignSection?.(sectionId)
    if (orderId) ServiceOrders.update(orderId, { assignToSection: sectionId })
  }

  const [sectionOrders, setSectionOrders] = useState<OrderType[]>([])

  const handleChangeAssignDate = (date: Date) => {
    assignDate?.(date)
    if (orderId) ServiceOrders.update(orderId, { scheduledAt: date })
  }

  useEffect(() => {
    if (assignedToSection) {
      const sectionOrders = orders.filter(
        (o) => o.assignToSection === assignedToSection
      )
      setSectionOrders(sectionOrders)
      // setSectionEvents(
      //   sectionOrders.map((o) => ({
      //     date: o.scheduledAt,
      //     title: o.fullName,
      //     id: o.id
      //   }))
      // )
    }
  }, [assignedToSection, orders])
  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        {sectionAssigned && (
          <View>
            <Text style={gStyles.h3}>Area</Text>
            <Text style={{ textAlign: 'center' }}>{sectionAssigned}</Text>
          </View>
        )}
        {assignedDate && (
          <View>
            <Text style={gStyles.h3}>Fecha</Text>
            <Text style={{ textAlign: 'center' }}>
              {dateFormat(asDate(assignedDate), 'dd MMM yy HH:mm')}
            </Text>
          </View>
        )}
      </View>
      <Button onPress={modal.toggleOpen} label="Asignar"></Button>
      <StyledModal {...modal}>
        <InputSelect
          value={assignedToSection}
          onChangeValue={(sectionId) => {
            if (sectionId !== assignedToSection)
              handleChangeAssignSection(sectionId)
          }}
          options={storeSections.map(({ name, id }) => ({
            label: name,
            value: id
          }))}
        />
        <WeekOrdersTimeLine
          orders={sectionOrders}
          assignedDate={assignedDate}
          onSelectDate={(date) => {
            handleChangeAssignDate?.(date)
          }}
        />
        {/* <WeekTimeline
          currentEventId={orderId}
          events={sectionEvents}
          dateSelected={asDate(assignedDate)}
          onSelectDate={(date) => {
            handleChangeAssignDate?.(date)
          }}
        /> */}
      </StyledModal>
    </>
  )
}
export default ModalAssignOrder
