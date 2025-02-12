import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { ListE } from './List'
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
import { ServiceOrders } from '../firebase/ServiceOrders'
import { levenshteinDistanceExtended } from './Customers/lib/levenshteinDistance'
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
                  modalConsolidateList.setOpen(true)
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

        <ListE
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
  const { consolidatedOrders, orders: ctxOrders } = useOrdersCtx()
  const { storeId, sections: storeSections } = useStore()
  const orders = consolidatedOrders?.orders || {}
  const [errors, setErrors] = useState(null)
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
  const [progressSimilar, setProgressSimilar] = useState(0)
  const [similarCostumerCount, setSimilarCostumerCount] = useState(0)
  const [createCustomerDisabled, setCreateCustomerDisabled] = useState(false)
  const [finished, setFinished] = useState(false)
  const { data: customers } = useCustomers()
  const modalSimilarCustomers = useModal({
    title: 'Clientes con datos similares'
  })
  const [newCustomer, setNewCustomer] = useState<Partial<
    CustomerType & { orderId?: string; orderFolio?: string }
  > | null>(null)

  const [process, setProcess] = useState<string[]>([])

  const handleCreateCustomers = async ({ ids }) => {
    setProcess((prev) => [...prev, 'Iniciando'])
    setCreateCustomerDisabled(true)
    let ordersWithSimilarCustomers = []
    let customersToCreate = []
    let ordersWithCustomerCreated = []
    const orders = data.filter((order) => ids.includes(order.id))
    let currentCustomers: Partial<CustomerType>[] = [...customers] // Hacer una copia del array

    setProcess((prev) => [...prev, `Buscando ordenes ${orders?.length}`])
    const fullOrders = await Promise.allSettled(
      orders.map((order) => ServiceOrders.get(order.id))
    ).then((res) =>
      res.filter((r) => r.status === 'fulfilled').map((r) => r.value)
    )
    setProcess((prev) => [...prev, `Ordenes encontradas ${fullOrders?.length}`])

    let indexOrders = 0
    setProcess((prev) => [...prev, `Buscando clientes similares`])
    for (const order of orders) {
      setProgress((prev) => prev + 1)

      const getFullOrder = () => {
        const fullOrder = fullOrders.find((o) => o.id === order.id)
        return fullOrder
      }
      const fullOrder = getFullOrder()
      const customer = customerFromOrder(fullOrder, { storeId })
      let similarCustomers = getSimilarCustomers(customer, currentCustomers)
      currentCustomers.push(customer)
      if (similarCustomers?.length) {
        ordersWithSimilarCustomers.push({ order, similarCustomers, customer })
        //*<------------------------ PUSH TO A LIST TO MERGE AT THE VERY END

        //* <---IF THE ORDER IS ALREA

        // if (!similarCustomers.some((c) => c.id === customer.id)) {
        //   ordersWithSimilarCustomers.push({ order, similarCustomers, customer })
        // } else {
        //   //ordersWithCustomerCreated.push({ order, similarCustomers, customer })
        // }
      } else {
        //*<------------------ ADD TO AN ARRAY OF PROMISES AND MAKE ALL PROMISES AT THE TIME
        customersToCreate.push(
          handleCreateCustomer({
            option: 'create',
            newCustomer: customer,
            storeId: customer.storeId,
            orderId: customer.orderId
          })
        )
      }
    }
    setProcess((prev) => [
      ...prev,
      `Ordenes con datos similares ${ordersWithSimilarCustomers.length}`
    ])
    setProcess((prev) => [
      ...prev,
      `Ordenes con cliente actualizado  ${ordersWithCustomerCreated.length}`
    ])
    //*<-------------------------------------- CRETE ALL COSTUMERS AT THE SAME TIME
    setProcess((prev) => [
      ...prev,
      `Creando clientes ${customersToCreate.length}`
    ])
    const results = await Promise.allSettled(customersToCreate)
    const successfulResults = results
      .filter(
        (result): result is PromiseFulfilledResult<any> =>
          result.status === 'fulfilled'
      )
      .map((result) => result.value)

    const failedResults = results
      .filter(
        (result): result is PromiseRejectedResult =>
          result.status === 'rejected'
      )
      .map((result) => result.reason)

    // Manejar errores
    if (failedResults?.length > 0) {
      console.error('Algunos clientes no pudieron ser creados:', failedResults)
      // Opcional: Mostrar mensaje al usuario
      setErrors(`${failedResults?.length} clientes no pudieron ser creados`)
    }

    // Continuar con los resultados exitosos
    const createdCustomers = successfulResults.filter(
      (result) => result.statusOk
    )
    setProcess((prev) => [
      ...prev,
      `Errores al crear clientes ${failedResults.length}`
    ])

    //currentCustomers.push(...createdCustomers.map((result) => result.customer))
    setProcess((prev) => [
      ...prev,
      `Clientes creados ${customersToCreate.length}`
    ])

    //*<----- merge or create customer if similar customers
    setProcess((prev) => [
      ...prev,
      `Merge clientes ${ordersWithSimilarCustomers.length}`
    ])

    let index = 0
    setSimilarCostumerCount(ordersWithSimilarCustomers.length)
    for (const {
      order,
      similarCustomers,
      customer
    } of ordersWithSimilarCustomers) {
      index++
      setProgressSimilar(index)

      modalSimilarCustomers.setOpen(true)
      const theMostSimilarCustomer = similarCustomers
        .map((c) => ({
          ...levenshteinDistanceExtended(customer.name, c.name),
          customer: c
        }))
        .sort((a, b) => a?.distance - b?.distance)[0]
      setSelectedCustomer(theMostSimilarCustomer?.customer)
      customer.orderFolio = order?.folio // add to show int the card when is merging TODO: remove once merged
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
        orderId,
        mergeCustomerId: customerSelectedId
      })

      if (!statusOk) return console.error(' an error ocurred')
      if (option === 'update') {
        //remove custemer resutl from current customers
        currentCustomers.filter((c) => c.id !== customerResult.id)
        currentCustomers.push(customerResult as CustomerType)
      }
      if (option === 'create') {
        currentCustomers.push(customerResult as CustomerType)
      }
      if (option === 'merge') {
      }
      if (option === 'cancel') {
      }
      setSelectedCustomer(null)
    }
    setProcess((prev) => [...prev, 'Terminado'])
    setCreateCustomerDisabled(true)
    setFinished(true)
    setSelectedCustomer(null)

    modalSimilarCustomers.setOpen(false)
  }

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
              <ButtonAddCustomerE orderId={item.id} />
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
              {finished && (
                <Text
                  style={[gStyles.tCenter, gStyles.h2, { marginVertical: 10 }]}
                >
                  Se han creado los clientes correctamente
                </Text>
              )}
              {!finished && (
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
                  {progressSimilar > 0 && (
                    <View>
                      <Text style={gStyles.tCenter}>Merge clientes </Text>
                      <Text style={gStyles.h1}>
                        Folio: {newCustomer?.orderFolio}
                      </Text>
                      <Text style={gStyles.h3}>
                        {progressSimilar} de {similarCostumerCount}
                      </Text>
                    </View>
                  )}
                  <CustomerCardE customer={newCustomer} />

                  <View
                    style={{
                      flex: 1,
                      minHeight: 200, // altura mínima
                      marginVertical: 10
                    }}
                  >
                    <SimilarCustomersList
                      onSelectCustomer={handleSelectCustomer}
                      selectedCustomer={selectedCustomer}
                      similarCustomers={removeDuplicatesByID(similarCustomers)}
                      style={{ flexGrow: 1, maxHeight: 200 }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'space-around',
                      flexWrap: 'wrap',
                      marginVertical: 10
                    }}
                  >
                    <Button
                      buttonStyles={{ marginVertical: 4 }}
                      fullWidth
                      size="medium"
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
                    <Button
                      buttonStyles={{ marginVertical: 4 }}
                      fullWidth
                      size="medium"
                      label="Actualizar cliente"
                      icon="edit"
                      color="secondary"
                      onPress={async () => {
                        setDisabled(true)
                        await userChoiceHandler({
                          option: 'update',
                          customerId: selectedCustomer?.id
                        })
                        setDisabled(false)
                      }}
                      disabled={disabled}
                    />

                    <Button
                      buttonStyles={{ marginVertical: 4 }}
                      fullWidth
                      size="medium"
                      label="Agregar a cliente "
                      icon="merge"
                      onPress={async () => {
                        setDisabled(true)
                        await userChoiceHandler({
                          option: 'merge',
                          customerId: selectedCustomer?.id
                        })
                        setDisabled(false)
                      }}
                      disabled={disabled || !selectedCustomer}
                    />

                    <Button
                      buttonStyles={{ marginVertical: 4 }}
                      fullWidth
                      size="medium"
                      autoFocus
                      label="Nuevo cliente"
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
                  </View>
                </StyledModal>
              )}

              {progress > 0 && (
                <View>
                  <Text>Creando </Text>
                  <Text>
                    {progress} de {ids.length || 0}{' '}
                  </Text>
                </View>
              )}

              {process?.map((p, i) => (
                <Text key={i}>{p}</Text>
              ))}
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
              {canCreateCustomers ? (
                <Button
                  label="Crear multiples clientes"
                  disabled={createCustomerDisabled}
                  onPress={() => {
                    handleCreateCustomers({ ids })
                  }}
                ></Button>
              ) : (
                <Text>No puedes crear clientes</Text>
              )}
            </View>
          )
        }}
      />
    </View>
  )
}
const removeDuplicatesByID = <T extends { id: string }>(array: T[]): T[] =>
  array.filter(
    (item, index, self) => index === self.findIndex((i) => i.id === item.id)
  )
