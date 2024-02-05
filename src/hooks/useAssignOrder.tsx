import { useStore } from '../contexts/storeContext'
import { ServiceOrders } from '../firebase/ServiceOrders'

export default function useAssignOrder({ orderId }: { orderId: string }) {
  const { orders, storeSections, staff } = useStore()
  const order = orders?.find((o) => o?.id === orderId)
  const assignedToStaff = staff.find((s) => s.id === order.assignTo)?.name
  const assignedToSection = storeSections.find(
    (s) => s.id === order.assignToSection
  )?.name
  const assignToSection = async (sectionId: string) => {
    return await ServiceOrders.update(orderId, {
      assignToSection: sectionId
    }).catch(console.error)
  }
  const assignToStaff = async (staffId: string) => {
    return await ServiceOrders.update(orderId, { assignTo: staffId }).catch(
      console.error
    )
  }
  return {
    assignedToSection,
    assignToSection,
    assignedToStaff,
    assignToStaff
  }
}
