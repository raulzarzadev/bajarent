import { FlexStyle, Pressable, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import StyledModal from './StyledModal'
import CurrencyAmount from './CurrencyAmount'
import useModal from '../hooks/useModal'
import { BalanceAmountsE } from './BalanceAmounts'
import { payments_amount } from '../libs/payments'
import { gStyles } from '../styles'
import ProgressBar from './ProgressBar'
import { CurrentWorks, useCurrentWorkCtx } from '../contexts/currentWorkContext'
import ListOrders from './ListOrders'
import { useEmployee } from '../contexts/employeeContext'
import DisabledEmployee from './DisabledEmployee'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import SectionProgressWork from './SectionProgressWork'
import OrderType from '../types/OrderType'
import Icon, { IconName } from './Icon'
import { Dimensions } from 'react-native'
import HeaderDate from './HeaderDate'
import { ServiceCurrentWork } from '../firebase/ServiceCurrentWork'
import { endDate, startDate } from '../libs/utils-date'
import { CurrentWorkE } from './CurrentWork/CurrentWork'

const modalSize = Dimensions.get('window')?.width > 500 ? 'md' : 'full'
const ModalCurrentWork = () => {
  const { permissions } = useEmployee()
  const { currentBalance } = useStore()
  const modal = useModal({ title: 'Trabajo actual' })

  const progress = 0
  const payments = []

  // if any of the permissions is true, or employee is disabled then the modal is open
  if (permissions.canViewModalCurrentWork) return null

  return (
    <View style={{ marginRight: 8 }}>
      <Pressable onPress={modal.toggleOpen}>
        <ProgressWork progress={progress} size="lg" />
        <CurrencyAmount
          style={gStyles.helper}
          amount={payments_amount(payments)?.total}
        />
      </Pressable>
      <StyledModal {...modal} size={modalSize}>
        <CurrentWorkE />
      </StyledModal>
    </View>
  )
}

// const ProgressWorkDetails = ({ onPressOrderRow }) => {
//   const { currentWork } = useCurrentWorkCtx()
//   const { sections: storeSections } = useStore()
//   return (
//     <View>
//       {/* <CurrentWork
//         currentWork={currentWork}
//         storeSections={storeSections}
//         onPressOrderRow={onPressOrderRow}
//       /> */}
//     </View>
//   )
// }

// const CurrentWork = ({ currentWork, storeSections, onPressOrderRow }) => {
//   const {
//     permissions: { isAdmin, isOwner }
//   } = useEmployee()
//   const {
//     deliveredOrders = [],
//     authorizedOrders = [],
//     solvedReported = [],
//     unsolvedReported = [],
//     pickedUpOrders = [],
//     renewedOrders = [],
//     expiredOrders = [],
//     sections = []
//   } = currentWork || {}
//   return (
//     <View>
//       {sections?.map((sectionId) => (
//         <View key={sectionId}>
//           <Text style={[gStyles.h2, { textAlign: 'center' }]}>
//             {storeSections?.find((s) => s.id === sectionId)?.name}
//           </Text>
//         </View>
//       ))}
//       {sections?.length === 0 && (
//         <Text style={[gStyles.h2, { textAlign: 'center' }]}>Todas</Text>
//       )}
//       <View style={{ marginVertical: 8, marginBottom: 16 }}>
//         <SectionProgressWork
//           authorized={authorizedOrders}
//           delivered={deliveredOrders}
//           expired={expiredOrders}
//           resolved={[...renewedOrders, ...pickedUpOrders]}
//           reported={unsolvedReported}
//           reportedSolved={solvedReported}
//           onPressOrderRow={onPressOrderRow}
//         />
//         <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
//           <ModalOrders
//             label="Recogidas"
//             orders={pickedUpOrders as OrderType[]}
//           />
//           <ModalOrders
//             label="Renovadas"
//             orders={renewedOrders as OrderType[]}
//           />
//         </View>
//       </View>
//       {(isAdmin || isOwner) && (
//         <SectionsCurrentWork onPressOrderRow={onPressOrderRow} />
//       )}
//     </View>
//   )
// }

// const ModalOrders = ({
//   label,
//   orders = []
// }: {
//   label: string
//   orders: OrderType[]
// }) => {
//   const modalOrders = useModal({ title: label })
//   return (
//     <View>
//       <Pressable onPress={modalOrders.toggleOpen}>
//         <Text style={gStyles.tBold}>
//           {label} {orders?.length}
//         </Text>
//       </Pressable>
//       <StyledModal {...modalOrders}>
//         <ListOrders orders={orders} />
//       </StyledModal>
//     </View>
//   )
// }

// const SectionsCurrentWork = ({ onPressOrderRow }) => {
//   const { sections: storeSections } = useStore()
//   const {
//     currentWork: {
//       authorizedOrders = [],
//       deliveredOrders = [],
//       expiredOrders = [],
//       renewedOrders = [],
//       pickedUpOrders = [],
//       solvedReported = [],
//       unsolvedReported = []
//     } = {}
//   } = useCurrentWorkCtx()
//   return (
//     <View>
//       {storeSections
//         .sort((a, b) => a.name.localeCompare(b.name))
//         .map((section) => {
//           const authorized = authorizedOrders.filter(
//             (order) => order.assignToSection === section.id
//           )
//           const delivered = deliveredOrders.filter(
//             (order) => order.assignToSection === section.id
//           )
//           const expired = expiredOrders.filter(
//             (order) => order.assignToSection === section.id
//           )
//           const resolved = [...renewedOrders, ...pickedUpOrders].filter(
//             (order) => order.assignToSection === section.id
//           )
//           const reported = unsolvedReported.filter(
//             (order) => order.assignToSection === section.id
//           )
//           const reportedSolved = solvedReported.filter(
//             (order) => order.assignToSection === section.id
//           )
//           if (
//             [
//               ...authorized,
//               ...delivered,
//               ...expired,
//               ...resolved,
//               ...reported,
//               ...reportedSolved
//             ]?.length === 0
//           )
//             return null

//           return (
//             <View key={section.id}>
//               <Text style={[gStyles.h2, { textAlign: 'center' }]}>
//                 {section.name}
//               </Text>
//               <SectionProgressWork
//                 onPressOrderRow={onPressOrderRow}
//                 authorized={authorized}
//                 delivered={delivered}
//                 expired={expired}
//                 resolved={resolved}
//                 reported={reported}
//                 reportedSolved={reportedSolved}
//               />
//             </View>
//           )
//         })}
//     </View>
//   )
// }

export const ProgressWork = ({
  progress = 0,
  label = '',
  width = 'auto',
  size = 'md',
  underLabel = '',
  icon
}: {
  progress: number
  label?: string
  width?: FlexStyle['width']
  size?: 'sm' | 'md' | 'lg'
  underLabel?: string
  icon?: IconName
}) => {
  //* if progress less than 25% color is error, if less than 50% color is warning, if less than 75% color is primary, else color is success
  const color =
    progress < 25
      ? 'error'
      : progress < 50
      ? 'warning'
      : progress < 75
      ? 'success'
      : 'primary'

  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 4,
        width
      }}
    >
      <Text style={[{ textAlign: 'center' }, gStyles.tBold]}>
        {icon && <Icon icon={icon} size={14} />}
        {label} {progress.toFixed(0)}%
      </Text>
      <ProgressBar progress={progress} color={color} size={size} />
      {!!underLabel && (
        <Text style={[{ textAlign: 'center' }, gStyles.helper]}>
          {underLabel}
        </Text>
      )}
    </View>
  )
}
export const ModalCurrentWorkE = (props) => (
  <ErrorBoundary componentName="ModalCurrentWork">
    <ModalCurrentWork {...props} />
  </ErrorBoundary>
)
export default ModalCurrentWork
