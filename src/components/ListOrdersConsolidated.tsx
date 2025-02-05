import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { ListE, LoadingList } from './List'
import ListRow, { ListRowField } from './ListRow'
import {
  ConsolidatedOrderType,
  ConsolidatedStoreOrdersType,
  ServiceConsolidatedOrders
} from '../firebase/ServiceConsolidatedOrders'
import { useNavigation } from '@react-navigation/native'
import { useOrdersCtx } from '../contexts/ordersContext'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import { colors } from '../theme'
import OrderDirectives from './OrderDirectives'
import asDate, { dateFormat, fromNow } from '../libs/utils-date'
import ErrorBoundary from './ErrorBoundary'
import MultiOrderActions from './OrderActions/MultiOrderActions'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import Button from './Button'
import {
  ButtonAddCustomerE,
  getSimilarCustomers,
  SimilarCustomersList
} from './Customers/ButtonAddCustomer'
import useMyNav from '../hooks/useMyNav'
import {
  CreateCustomerChoiceType,
  useCustomers
} from '../state/features/costumers/costumersSlice'
import { customerFromOrder } from './Customers/lib/customerFromOrder'
import TextInfo from './TextInfo'
import { CustomerType } from '../state/features/costumers/customerType'
import { CustomerCardE } from './Customers/CustomerCard'
import { useEmployee } from '../contexts/employeeContext'
export type OrderWithId = Partial<ConsolidatedOrderType> & {
  id: string
  itemsString?: string
  isCustomer?: boolean
}

const ListOrdersConsolidated = () => {
  const modalConsolidateList = useModal({ title: 'Otras consolidadas' })

  const { consolidatedOrders, handleRefresh, setOtherConsolidated } =
    useOrdersCtx()
  const { storeId, sections: storeSections } = useStore()
  const { navigate } = useNavigation()
  const orders = consolidatedOrders?.orders || {}
  const [disabled, setDisabled] = useState(false)

  const [otherConsolidates, setOtherConsolidates] = useState<
    ConsolidatedStoreOrdersType[]
  >([])
  const [otherConsolidatedCount, setOtherConsolidatedCount] = useState(10)

  const data: OrderWithId[] = Array.from(Object.values(orders)).map((order) => {
    const assignedToSection =
      storeSections?.find((section) => section.id === order.assignToSection)
        ?.name || null
    return {
      id: order.id,
      ...order,
      assignToSectionName: assignedToSection,
      isCustomer: !!order.customerId
    }
  })

  useEffect(() => {
    if (storeId)
      ServiceConsolidatedOrders.getLasts({
        storeId,
        count: otherConsolidatedCount
      }).then((res) => {
        setOtherConsolidates(res)
      })
  }, [storeId, otherConsolidatedCount])

  const handleConsolidate = async () => {
    setDisabled(true)
    await ServiceConsolidatedOrders.consolidate(storeId)
      .then((res) => {
        console.log({ res })
      })
      .catch((err) => {
        console.error(err)
      })

    await handleRefresh()
    setDisabled(false)
  }

  return (
    <ScrollView>
      <View>
        <StyledModal {...modalConsolidateList}>
          {otherConsolidates.map((consolidated) => {
            return (
              <Pressable
                key={consolidated.id}
                onPress={() => {
                  setOtherConsolidated({ consolidated })
                  modalConsolidateList.toggleOpen()
                }}
              >
                <Text>
                  {dateFormat(asDate(consolidated.createdAt))}{' '}
                  <Text style={gStyles.tBold}>{consolidated.ordersCount}</Text>
                </Text>
              </Pressable>
            )
          })}
          <Button
            size="xs"
            variant="ghost"
            onPress={() => {
              setOtherConsolidatedCount(otherConsolidatedCount + 10)
            }}
            label="mas"
            icon="down"
          ></Button>
        </StyledModal>

        <Pressable onPress={() => modalConsolidateList.toggleOpen()}>
          <Text style={[gStyles.helper, gStyles.tCenter]}>
            Última actualización{' '}
            {fromNow(asDate(consolidatedOrders?.createdAt))}
          </Text>
        </Pressable>

        <LoadingList
          ComponentRow={({ item }) => <ComponentRow item={item} />}
          pinRows
          collectionSearch={{
            collectionName: 'orders',
            fields: ['fullName', 'folio', 'status', 'neighborhood', 'note']
          }}
          ComponentMultiActions={({ ids }) => {
            return <MultiOrderActions ordersIds={ids} data={data} />
          }}
          data={data}
          //pinRows={true}
          rowsPerPage={20}
          sideButtons={[
            {
              icon: 'save',
              label: 'Consolidar',
              onPress: async () => {
                await handleConsolidate()
              },
              disabled,
              visible: true
            }
          ]}
          onPressRow={(orderId) => {
            //@ts-ignore
            navigate('StackConsolidated', {
              screen: 'OrderDetails',
              params: { orderId }
            })
          }}
          filters={[
            {
              field: 'isCustomer',
              label: 'Es cliente',
              boolean: true,
              icon: 'customerCard',
              booleanValue: true
            },
            {
              field: 'type',
              label: 'Tipo'
            },
            {
              field: 'status',
              label: 'Estatus'
            },
            {
              field: 'assignToSection',
              label: 'Area'
            },
            // {
            //   field: 'expireAt',
            //   label: 'Vencimiento'
            // },

            {
              field: 'neighborhood',
              label: 'Colonia'
            },
            {
              field: 'createdAt',
              label: 'Creación',
              isDate: true
            },
            {
              field: 'expireAt',
              label: 'Vencimiento',
              isDate: true
            },
            {
              field: 'deliveredAt',
              label: 'Entregada',
              isDate: true
            },
            {
              field: 'pickedUpAt',
              label: 'Recogida',
              isDate: true
            }
          ]}
          sortFields={[
            {
              key: 'folio',
              label: 'Folio'
            },
            {
              key: 'note',
              label: 'Contrato'
            },
            {
              key: 'fullName',
              label: 'Nombre'
            },
            {
              key: 'neighborhood',
              label: 'Colonia'
            },
            {
              key: 'type',
              label: 'Tipo'
            },
            {
              key: 'assignToSection',
              label: 'Area'
            },
            {
              key: 'status',
              label: 'Status'
            },
            {
              key: 'expireAt',
              label: 'Vencimiento'
            },
            {
              key: 'itemsString',
              label: 'Item'
            }
          ]}
        />
      </View>
    </ScrollView>
  )
}

const ComponentRow = ({ item: order }: { item: OrderWithId }) => {
  const { toCustomers } = useMyNav()
  const fields: ListRowField[] = [
    {
      width: 120,
      component: (
        <View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
          >
            <Text style={{ textAlign: 'center' }} numberOfLines={1}>
              {order?.folio}
            </Text>
            <Text style={{ textAlign: 'center' }} numberOfLines={1}>
              {order?.note}
            </Text>
          </View>
          <Text style={styles.cell} numberOfLines={1}>
            {order?.fullName}
          </Text>
        </View>
      )
    },
    {
      width: 70,
      component: (
        <View style={{ alignItems: 'stretch' }}>
          <Text
            style={[gStyles.helper, gStyles.tBold, gStyles.tCenter]}
            numberOfLines={1}
          >
            {order?.itemsString}
          </Text>
          <Text style={[gStyles.helper]} numberOfLines={1}>
            {order?.neighborhood}
          </Text>
        </View>
      )
    },
    // {
    //   width: 50,
    //   component: (
    //     <Text style={styles.cell} numberOfLines={1}>
    //       {order?.neighborhood}
    //     </Text>
    //   )
    // },
    {
      width: 'rest',
      //@ts-ignore
      component: <OrderDirectives order={order} />
    },
    {
      width: 100,
      component: order.customerId ? (
        <Button
          icon="customerCard"
          size="xs"
          fullWidth={false}
          onPress={() => {
            toCustomers({ to: 'details', id: order.customerId })
          }}
        />
      ) : null
    }
  ]
  return (
    <ListRow
      fields={fields}
      style={{
        marginVertical: 2,
        padding: 2,
        borderColor: 'transparent',
        backgroundColor: colors.white
      }}
    />
  )
}
const styles = StyleSheet.create({
  cell: {
    textAlign: 'center'
  }
})

export const ListOrdersConsolidatedE = (props) => (
  <ErrorBoundary componentName="ListOrdersConsolidated">
    <ListOrdersConsolidated {...props} />
  </ErrorBoundary>
)

export default ListOrdersConsolidated

export const ConsolidateCustomersList = () => {
  const { consolidatedOrders } = useOrdersCtx()
  const { storeId, sections: storeSections } = useStore()
  const orders = consolidatedOrders?.orders || {}

  const data: OrderWithId[] = Array.from(Object.values(orders)).map((order) => {
    const assignedToSection =
      storeSections?.find((section) => section.id === order.assignToSection)
        ?.name || null
    return {
      id: order.id,
      ...order,
      assignToSectionName: assignedToSection,
      isCustomer: !!order.customerId
    }
  })
  const reducedData = data

  const { handleCreateCustomer } = useCustomers()
  const { toCustomers } = useMyNav()
  const [progress, setProgress] = useState(0)
  const [createCustomerDisabled, setCreateCustomerDisabled] = useState(false)
  const [finished, setFinished] = useState(false)
  const { data: customers } = useCustomers()
  const modalSimilarCustomers = useModal({
    title: 'Clientes con datos similares'
  })
  const [newCustomer, setNewCustomer] = useState<Partial<
    CustomerType & { orderId?: string }
  > | null>(null)

  const handleCreateCustomers = async ({ ids }) => {
    setCreateCustomerDisabled(true)
    const orders = data.filter((order) => ids.includes(order.id))
    let currentCustomers = [...customers] // Hacer una copia del array
    for (const order of orders) {
      setProgress((prev) => prev + 1)

      const customer = customerFromOrder(order, { storeId })
      let similarCustomers = getSimilarCustomers(customer, currentCustomers)
      // console.log({
      //   customers: customers.length,
      //   currentCustomers: currentCustomers.length,
      //   similarCustomers,
      //   customer,
      //   progress
      // })
      if (similarCustomers.length) {
        modalSimilarCustomers.setOpen(true)
        setSelectedCustomer(similarCustomers[0])
        setNewCustomer(customer)
        setSimilarCustomers(similarCustomers)
        const orderId = order.id
        const { customerId: customerSelectedId, option: userOptionSelected } =
          await waitForUserChoice()

        const {
          option,
          customer: customerResult,
          statusOk
        } = await handleCreateCustomer({
          option: userOptionSelected,
          storeId,
          newCustomer: customer,
          orderId
        })

        if (!statusOk) return console.error(' an error ocurred')
        if (option === 'create') {
          modalSimilarCustomers.setOpen(false)
          currentCustomers.push(customerResult as CustomerType)
          setSelectedCustomer(null)
        }
        if (option === 'merge') {
          modalSimilarCustomers.setOpen(false)
          setSelectedCustomer(null)
        }
        if (option === 'cancel') {
          modalSimilarCustomers.setOpen(false)
          setSelectedCustomer(null)
          break
        }
      } else {
        const {
          option,
          customer: customerResult,
          statusOk
        } = await handleCreateCustomer({
          option: 'create',
          newCustomer: customer,
          storeId: customer.storeId,
          orderId: customer.orderId
        })
        if (statusOk) currentCustomers.push(customerResult as CustomerType)
      }
    }
    setCreateCustomerDisabled(false)
    setFinished(true)
  }
  console.log({ createCustomerDisabled })

  const waitForUserChoice = (): Promise<{
    option: CreateCustomerChoiceType
    customerId: string
  }> => {
    return new Promise<{
      option: CreateCustomerChoiceType
      customerId: string
    }>((resolve) => {
      const handleUserChoice = ({
        option,
        customerId
      }: {
        option: CreateCustomerChoiceType
        customerId: string
      }) => {
        resolve({ option, customerId })
      }

      // Pasar handleUserChoice como callback al Modal
      setUserChoiceHandler(() => handleUserChoice)
    })
  }

  const [userChoiceHandler, setUserChoiceHandler] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [similarCustomers, setSimilarCustomers] = useState([])
  const handleSelectCustomer = (customer) => {
    if (customer.id === selectedCustomer?.id) {
      setSelectedCustomer(null)
    } else {
      setSelectedCustomer(customer)
    }
  }
  const [disabled, setDisabled] = useState(false)
  const { permissions } = useEmployee()
  const canCreateCustomers = permissions?.customers?.write
  return (
    <View>
      <ListE
        rowsPerPage={40}
        data={reducedData}
        ComponentRow={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginVertical: 2
            }}
          >
            <Text>
              {item.folio} {item.fullName}
            </Text>

            {!item?.customerId && (
              // TODO: arregralr esto por que puede que no se esten formateadno correctamente los clientes
              <ButtonAddCustomerE order={item} />
            )}
            {item?.customerId && (
              <Button
                icon="arrowForward"
                onPress={() => {
                  toCustomers({ to: 'details', id: item?.customerId })
                }}
                color="success"
                justIcon
                variant="ghost"
                size="xs"
              />
            )}
          </View>
        )}
        filters={[
          {
            label: 'Es cliente',
            field: 'isCustomer',
            boolean: true,
            icon: 'customerCard',
            booleanValue: false,
            color: colors.blue,
            titleColor: colors.white
          }
        ]}
        sortFields={[
          {
            key: 'folio',
            label: 'Folio'
          },
          {
            key: 'fullName',
            label: 'Nombre'
          }
        ]}
        ComponentMultiActions={({ ids }) => {
          return (
            <View>
              <StyledModal
                {...modalSimilarCustomers}
                onclose={async () => {
                  setDisabled(true)
                  await userChoiceHandler({
                    option: 'cancel',
                    customerId: selectedCustomer?.id
                  })
                  setDisabled(false)
                }}
              >
                <CustomerCardE customer={newCustomer} />
                <SimilarCustomersList
                  onSelectCustomer={handleSelectCustomer}
                  selectedCustomer={selectedCustomer}
                  similarCustomers={similarCustomers}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                  }}
                >
                  <Button
                    label="Cancelar"
                    variant="ghost"
                    onPress={async () => {
                      setDisabled(true)
                      await userChoiceHandler({
                        option: 'cancel',
                        customerId: selectedCustomer?.id
                      })
                      setDisabled(false)
                    }}
                    disabled={disabled}
                  />
                  {!!selectedCustomer ? (
                    <Button
                      label="Agregar "
                      icon="merge"
                      onPress={async () => {
                        setDisabled(true)
                        await userChoiceHandler({
                          option: 'merge',
                          customerId: selectedCustomer?.id
                        })
                        setDisabled(false)
                      }}
                      disabled={disabled}
                    />
                  ) : (
                    <Button
                      label="Crear"
                      color="success"
                      icon="add"
                      onPress={async () => {
                        setDisabled(true)
                        await userChoiceHandler({
                          option: 'create',
                          customerId: selectedCustomer?.id
                        })
                        setDisabled(false)
                      }}
                      disabled={disabled}
                    />
                  )}
                </View>
              </StyledModal>
              {finished && (
                <Text
                  style={[gStyles.tCenter, gStyles.h2, { marginVertical: 10 }]}
                >
                  Se han creado los clientes correctamente
                </Text>
              )}
              {createCustomerDisabled && (
                <>
                  <Text style={gStyles.tCenter}>
                    Se estan creando los clientes
                  </Text>
                  <Text style={gStyles.tCenter}>
                    Creando <Text style={gStyles.tBold}>{progress}</Text> de{' '}
                    <Text style={gStyles.tBold}>{ids.length || 0} </Text>
                  </Text>
                </>
              )}
              {!createCustomerDisabled && !finished && (
                <>
                  <TextInfo
                    defaultVisible
                    type="warning"
                    text="Esto creara nuevos clientes y no verifica si estos existen o no antes de crearlo. Asegurate de no agregar clientes nuevos. "
                  ></TextInfo>
                  <TextInfo
                    defaultVisible
                    type="info"
                    text="Se modificara la orden con el nuevo usuario"
                  ></TextInfo>
                </>
              )}

              <Button
                label="Crear multiples clientes"
                disabled={
                  createCustomerDisabled || finished || !canCreateCustomers
                }
                onPress={() => handleCreateCustomers({ ids })}
              ></Button>
            </View>
          )
        }}
      />
    </View>
  )
}
