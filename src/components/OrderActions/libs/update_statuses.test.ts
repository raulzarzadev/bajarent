// //@ts-nocheck

// import { handleSetStatuses } from '../libs/update_statuses'
// import OrderType, {
//   TypeOrder,
//   order_status,
//   order_type
// } from '../../../types/OrderType'
// import { subDays } from 'date-fns'
// import { is } from 'cypress/types/bluebird'
// const defaultValues: Partial<OrderType> = {
//   id: '123',
//   expireAt: null,
//   isDelivered: false,
//   isRenewed: false,
//   isExpired: false,
//   isReported: false,
//   hasDelivered: false
// }

// it('ORDER hasDelivery isDelivered=true', () => {
//   const order: Partial<OrderType> = {
//     ...defaultValues,
//     hasDelivered: true
//     // other properties
//   }
//   const updatedOrder = handleSetStatuses({ order })
//   expect(updatedOrder.order).toEqual({
//     ...order,
//     isDelivered: true,
//     expireAt: null,
//     isRenewed: false
//   })
// })
// describe('handleSetStatuses', () => {
//   it('STATUS IS THE SAME', () => {
//     const order: Partial<OrderType> = {
//       id: '123',
//       status: order_status.PENDING
//       // other properties
//     }

//     const updatedOrder = handleSetStatuses({ order })

//     expect(updatedOrder.order.status).toEqual(order_status.PENDING)
//   })
//   it('RENT DELIVERED isDelivered=true expireAt=Date', () => {
//     const order: Partial<OrderType> = {
//       ...defaultValues,
//       status: order_status.DELIVERED,
//       type: order_type.RENT,
//       deliveredAt: new Date(),
//       items: [
//         {
//           priceSelected: {
//             time: '1 day'
//           }
//         }
//       ]
//       // other properties
//     }

//     const updatedOrder = handleSetStatuses({ order })

//     expect(updatedOrder.order).toEqual({
//       ...order,
//       status: order_status.DELIVERED,
//       isDelivered: true,
//       expireAt: expect.any(Date),
//       isRenewed: false
//     })
//   })

//   it('RENT PICKED_UP isDelivered=false ', () => {
//     const order: Partial<OrderType> = {
//       ...defaultValues,
//       type: order_type.RENT,
//       status: order_status.PICKED_UP,
//       deliveredAt: new Date(),
//       items: [
//         {
//           priceSelected: {
//             time: '1 day'
//           }
//         }
//       ]
//       // other properties
//     }

//     const updatedOrder = handleSetStatuses({ order })

//     expect(updatedOrder.order).toEqual({
//       ...order,
//       status: order_status.PICKED_UP,
//       isDelivered: false,
//       expireAt: expect.any(Date)
//     })
//   })

//   it('RENT DELIVERED no-item  expireAt=null isDelivered=true', () => {
//     const order: Partial<OrderType> = {
//       ...defaultValues,
//       type: order_type.RENT,
//       status: order_status.DELIVERED,
//       deliveredAt: new Date()
//       // other properties
//     }

//     const updatedOrder = handleSetStatuses({ order })

//     expect(updatedOrder.order).toEqual({
//       ...order,
//       status: order_status.DELIVERED,
//       isDelivered: true,
//       expireAt: null
//     })
//   })
//   it('RENT DELIVERED no-time expireAt=null isDelivered=true ', () => {
//     const order: Partial<OrderType> = {
//       ...defaultValues,
//       type: order_type.RENT,
//       status: order_status.DELIVERED,
//       isRenewed: false
//       // other properties
//     }

//     const updatedOrder = handleSetStatuses({ order })

//     expect(updatedOrder.order).toEqual({
//       ...order,
//       status: order_status.DELIVERED,
//       isDelivered: true,
//       expireAt: null,
//       isRenewed: false
//     })
//   })

//   it('RENT RENEWED isRenewed=true isDelivered=false ', () => {
//     const order: Partial<OrderType> = {
//       ...defaultValues,
//       type: order_type.RENT,
//       status: order_status.RENEWED,
//       items: [
//         {
//           priceSelected: {
//             time: '1 day'
//           }
//         }
//       ]
//       // other properties
//     }

//     const updatedOrder = handleSetStatuses({ order })

//     expect(updatedOrder.order).toEqual({
//       ...order,
//       status: order_status.RENEWED,
//       isDelivered: false,
//       expireAt: null,
//       isRenewed: true
//     })
//   })

//   it('RENT  EXPIRED isExpired=true isDelivery=true', () => {
//     const order: Partial<OrderType> = {
//       ...defaultValues,
//       type: order_type.RENT,
//       status: order_status.DELIVERED,
//       items: [
//         {
//           priceSelected: {
//             time: '1 day'
//           }
//         }
//       ],
//       deliveredAt: subDays(new Date(), 2)
//       // other properties
//     }

//     const updatedOrder = handleSetStatuses({ order, reports: [] })

//     expect(updatedOrder.order).toEqual({
//       ...order,
//       status: order_status.DELIVERED,
//       isDelivered: true,
//       expireAt: expect.any(Date),
//       isRenewed: false,
//       isExpired: true
//     })
//   })
//   it('REPORTS UNSOLVED_REPORTS isReported=true', () => {
//     const order: Partial<OrderType> = {
//       ...defaultValues,
//       status: order_status.DELIVERED,
//       items: [
//         {
//           priceSelected: {
//             time: '1 day'
//           }
//         }
//       ],
//       deliveredAt: subDays(new Date(), 2)
//       // other properties
//     }

//     const updatedOrder = handleSetStatuses({
//       order,
//       reports: [{ content: 'Report', type: 'report' }]
//     })
//     const updatedOrder2 = handleSetStatuses({
//       order,
//       reports: [{ content: 'Report', type: 'report', solved: true }]
//     })

//     expect(updatedOrder.order).toEqual({
//       ...order,
//       status: order_status.DELIVERED,
//       isDelivered: true,
//       expireAt: expect.any(Date),
//       isRenewed: false,
//       isExpired: true,
//       isReported: true
//     })
//     expect(updatedOrder2.order).toEqual({
//       ...order,
//       status: order_status.DELIVERED,
//       isDelivered: true,
//       expireAt: expect.any(Date),
//       isRenewed: false,
//       isExpired: true,
//       isReported: false
//     })
//   })

//   it('REPAIR/RENT PENDING | AUTHORIZE | CANCELLED isDelivery=null expiredAt=null', () => {
//     const order: Partial<OrderType> = {
//       ...defaultValues,
//       id: '123',
//       type: order_type.REPAIR,
//       status: order_status.PENDING
//       // other properties
//     }
//     const order2: Partial<OrderType> = {
//       ...defaultValues,
//       type: order_type.RENT,
//       status: order_status.AUTHORIZED
//       // other properties
//     }

//     const updatedOrder = handleSetStatuses({ order })
//     const updatedOrder2 = handleSetStatuses({ order: order2 })

//     expect(updatedOrder.order).toEqual({
//       ...order,
//       status: order_status.PENDING,
//       isDelivered: null,
//       expireAt: null,
//       isRenewed: false
//     })
//     expect(updatedOrder2.order).toEqual({
//       ...order2,
//       isDelivered: null,
//       expireAt: null,
//       isRenewed: false
//     })
//   })
//   it('ORDER hasDelivery isDelivered=true', () => {
//     const order: Partial<OrderType> = {
//       ...defaultValues,
//       hasDelivered: true
//       // other properties
//     }

//     const updatedOrder = handleSetStatuses({ order })

//     expect(updatedOrder.order).toEqual({
//       ...order,
//       isDelivered: true,
//       expireAt: null,
//       isRenewed: false
//     })
//   })
// })
