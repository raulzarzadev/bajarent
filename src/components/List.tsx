import {
  FlatList,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  View
  //   Dimensions
} from 'react-native'
import useSort from '../hooks/useSort'
import { FC, useEffect, useState } from 'react'
import Icon, { IconName } from './Icon'

import ErrorBoundary from './ErrorBoundary'
import ModalFilterList, { FilterListType } from './ModalFilterList'
import Button, { ButtonProps } from './Button'
import InputCheckbox from './InputCheckbox'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import Loading from './Loading'
import { gStyles } from '../styles'
import { getItem, setItem } from '../libs/storage'
import { CollectionSearch } from '../hooks/useFilter'
import { ServiceOrders } from '../firebase/ServiceOrders'
import theme from '../theme'

export type ListSideButton = {
  icon: IconName
  label: string
  onPress: (rowId?: string) => void
  visible?: boolean
  disabled?: boolean
  color?: ButtonProps['color']
}
export type ListPops<T extends { id: string }> = {
  data: T[]
  preFilteredIds?: string[]
  onPressRow?: (orderId: string) => void
  sortFields?: { key: string; label: string }[]
  ComponentRow: FC<{ item: T }>
  defaultSortBy?: keyof T
  filters: FilterListType<T>[]
  defaultOrder?: 'asc' | 'des'
  sideButtons?: ListSideButton[]
  rowsPerPage?: number
  ComponentMultiActions?: FC<{ ids: string[] }>
  collectionSearch?: CollectionSearch
  onFetchMore?: () => void
  pinRows?: boolean
  onFetchMoreCount?: string
  maxWidth?: number
  rowSideButtons?: ListSideButton[]
  pinMaxRows?: number
  onRowsSelected?: (ids: string[]) => void
}

function MyList<T extends { id: string }>({
  data,
  onPressRow,
  sortFields,
  ComponentRow,
  ComponentMultiActions,
  defaultSortBy,
  defaultOrder = 'asc',
  filters,
  preFilteredIds,
  sideButtons = [],
  rowsPerPage = 10,
  collectionSearch,
  onFetchMore,
  pinRows,
  onFetchMoreCount,
  maxWidth = 600,
  rowSideButtons,
  pinMaxRows,
  onRowsSelected
}: ListPops<T>) {
  const [filteredData, setFilteredData] = useState<T[]>(undefined)
  const [collectionData, setCollectionData] = useState<T[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [multiSelect, setMultiSelect] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [pinnedRows, setPinnedRows] = useState<string[]>([])
  const [pinnedRowsData, setPinnedRowsData] = useState<T[]>([])
  //* PIN ROWS

  //#region hooks

  const { sortBy, order, sortedBy, sortedData, changeOrder } = useSort<T>({
    data: filteredData,
    defaultSortBy: defaultSortBy as string,
    defaultOrder
  })

  const multiSelectActionsModal = useModal({ title: 'Acciones' })

  //* pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, sortedData.length)

  //#region effects

  useEffect(() => {
    ;(async () => {
      const storedPinnedRows = await getItem('pinnedRows')
      if (storedPinnedRows) {
        const items = JSON.parse(storedPinnedRows || '[]')
        const validItems = items?.filter((id) =>
          data?.find((row) => row?.id === id)
        )
        setPinnedRows(validItems)
      }
    })()
  }, [data])

  useEffect(() => {
    if (pinnedRows?.length && pinRows) {
      getPinnedRows(pinnedRows).then((res) => {
        setPinnedRowsData(res)
      })
    } else {
      setPinnedRowsData([])
    }
  }, [pinnedRows])

  useEffect(() => {
    if ((filteredData?.length || 0) <= 10) {
      setCurrentPage(1)
    }
  }, [filteredData?.length])

  //#region handlers

  // const handleMultiSelect = () => {
  //   setMultiSelect(!multiSelect)
  //   if (!multiSelect) setSelectedRows([])
  // }
  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      const newSelectedRows = selectedRows.filter((rowId) => rowId !== id)
      setSelectedRows(newSelectedRows)

      onRowsSelected?.(selectedRows)
    } else {
      const newSelectedRows = [...selectedRows, id]
      setSelectedRows(newSelectedRows)
      onRowsSelected?.(newSelectedRows)
    }
  }

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const getPinnedRows = async (pinnedRows: string[]): Promise<T[]> => {
    if (collectionSearch?.collectionName === 'orders') {
      const promises = pinnedRows.map((id) => ServiceOrders.get(id))
      const res = await Promise.all(promises)
      return res as unknown as T[]
    } else {
      return []
    }
  }

  const handleUnpinRow = (id: string) => {
    setPinnedRows((prevPinnedRows) => {
      const newPinnedRows = prevPinnedRows.filter((rowId) => rowId !== id)
      setItem('pinnedRows', JSON.stringify(newPinnedRows || []))
      return newPinnedRows
    })
  }

  const handlePinRow = (id: string) => {
    setPinnedRows((prevPinnedRows) => {
      const newPinnedRows = [...prevPinnedRows, id]
      setItem('pinnedRows', JSON.stringify(newPinnedRows || []))
      return newPinnedRows
    })
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([])
    } else {
      setSelectedRows(sortedData.map((row) => row?.id))
    }
    setSelectAll(!selectAll)
  }

  const [_pressedRow, _setPressedRow] = useState(null)

  //#region render

  if (!data) return <Loading />

  const slicedData = sortedData.slice(startIndex, endIndex)

  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          //margin: 'auto',
          width: '100%',
          maxWidth: maxWidth,
          margin: 'auto'
        }}
      >
        {pinRows && (
          <>
            {pinnedRows.length > 0 && (
              <>
                <Text style={gStyles.h3}>Fijadas {pinnedRows.length || 0}</Text>
                {pinnedRows.length === pinMaxRows && (
                  <Text style={[gStyles.helper, { textAlign: 'center' }]}>
                    Solo puedes fijar {pinMaxRows} filas
                  </Text>
                )}
              </>
            )}
            <FlatList
              data={pinnedRowsData || []}
              renderItem={({ item }) => (
                <View style={{ width: '100%', flexDirection: 'row', flex: 1 }}>
                  <Pressable
                    style={{ flexDirection: 'row', flex: 1 }}
                    onPress={() => {
                      onPressRow && onPressRow(item?.id)
                    }}
                  >
                    <ComponentRow item={item} />
                  </Pressable>
                  {/* ***************** ******* ***** UNPIN BUTTON  */}
                  <PinButton
                    handlePin={() => {
                      handleUnpinRow(item?.id)
                    }}
                    unpin={true}
                  />
                </View>
              )}
            />
          </>
        )}
        <View>
          {/* SEARCH FILTER AND SIDE BUTTONS   */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-start',
              width: '100%',
              maxWidth: 500,
              margin: 'auto',
              padding: 4
            }}
          >
            {sideButtons?.map(
              (button, index) =>
                button.visible && (
                  <View key={index} style={{ marginHorizontal: 2 }}>
                    <Button
                      icon={button?.icon}
                      // label={button.label}
                      onPress={button?.onPress}
                      size="xs"
                      disabled={button?.disabled}
                    ></Button>
                  </View>
                )
            )}

            <ModalFilterList
              collectionSearch={collectionSearch}
              preFilteredIds={preFilteredIds}
              data={data}
              setData={(data) => {
                setFilteredData(data)
                //setCurrentPage(1) //* FIXME: this mai cause a bug if uncomment
              }}
              filters={filters}
              setCollectionData={(data) => {
                setCollectionData(data)
              }}
            />
          </View>

          {/* PAGINATION */}

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View style={{ width: '30%', justifyContent: 'center' }}>
              {!multiSelect && (
                <Button
                  label={'Seleccionar'}
                  variant={'ghost'}
                  size="xs"
                  onPress={() => {
                    setMultiSelect(true)
                  }}
                ></Button>
              )}
              {multiSelect && (
                <>
                  <Button
                    icon="settings"
                    buttonStyles={{ margin: 'auto' }}
                    onPress={() => {
                      multiSelectActionsModal.toggleOpen()
                    }}
                    disabled={selectedRows.length === 0}
                    label="Acciones"
                    size="xs"
                    color="secondary"
                    variant="ghost"
                  ></Button>
                  <StyledModal {...multiSelectActionsModal}>
                    <ComponentMultiActions ids={selectedRows} />
                  </StyledModal>
                </>
              )}
            </View>
            <View style={{ width: '40%', justifyContent: 'center' }}>
              <Pagination
                currentPage={currentPage}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                totalPages={totalPages}
              />
            </View>
            <View style={{ width: '30%', justifyContent: 'center' }}>
              {multiSelect && (
                <Button
                  label={`Cancelar ${selectedRows.length || 0}`}
                  variant={'ghost'}
                  size="xs"
                  onPress={() => {
                    setSelectedRows([])
                    setSelectAll(false)
                    setMultiSelect(false)
                  }}
                ></Button>
              )}
            </View>
          </View>

          {/* SORT OPTIONS   */}
          <View
            style={{
              padding: 2,

              justifyContent: 'center',
              // marginTop: gSpace(2),
              maxWidth: '100%'
            }}
          >
            <FlatList
              style={{
                paddingBottom: 6,
                paddingTop: 6
              }}
              horizontal
              data={sortFields}
              renderItem={({ item: field }) => (
                <View key={field.key}>
                  <Pressable
                    onPress={() => {
                      // sortBy(field.key)
                      sortBy(field.key)
                      changeOrder()
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      margin: 4,
                      width: 72
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontWeight: sortedBy === field.key ? 'bold' : 'normal'
                      }}
                    >
                      {field.label}
                    </Text>
                    {sortedBy === field.key && (
                      <Icon icon={order === 'asc' ? 'up' : 'down'} size={12} />
                    )}
                  </Pressable>
                </View>
              )}
            />
          </View>
        </View>

        {/* MULTI-SELECT  */}
        {multiSelect && (
          <View
            style={{
              alignSelf: 'flex-start'
            }}
          >
            <InputCheckbox
              value={selectAll}
              setValue={handleSelectAll}
              label="Todas"
            />
          </View>
        )}

        {/* CONTENT  */}
        <SectionList
          sections={[
            { title: 'Otras coicidencias', data: collectionData },
            { title: 'base', data: slicedData }
          ]}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  flex: 1,
                  alignItems: 'center'
                }}
              >
                {multiSelect && (
                  <InputCheckbox
                    key={item?.id}
                    setValue={() => {
                      handleSelectRow(item?.id)
                      _setPressedRow(item?.id)
                    }}
                    value={selectedRows.includes(item?.id)}
                  />
                )}
                <Pressable
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor:
                      _pressedRow === item?.id ? '#00000020' : 'transparent'
                  }}
                  onPress={() => {
                    _setPressedRow(item?.id)
                    if (multiSelect) {
                      handleSelectRow(item?.id)
                    } else {
                      onPressRow && onPressRow(item?.id)
                    }
                  }}
                >
                  <ComponentRow item={item} />
                </Pressable>
                {rowSideButtons?.map((button, index) => (
                  <View
                    key={index}
                    style={{
                      marginHorizontal: 2,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Button
                      icon={button?.icon}
                      justIcon={!!button?.icon}
                      color={button?.color}
                      // label={button.label}
                      onPress={() => button?.onPress(item?.id)}
                      size="xs"
                      disabled={button?.disabled}
                    ></Button>
                  </View>
                ))}

                {pinRows && (
                  <>
                    {/* ***************** ******* ***** PIN BUTTON  */}
                    {!pinnedRows.includes(item?.id) ? (
                      <PinButton
                        disabled={pinnedRows.length >= pinMaxRows}
                        handlePin={() => {
                          handlePinRow(item?.id)
                        }}
                      />
                    ) : (
                      <PinButton
                        handlePin={() => {
                          handleUnpinRow(item?.id)
                        }}
                        unpin={true}
                      />
                    )}

                    {/* ***************** ******* ***** PIN BUTTON  */}
                  </>
                )}
              </View>
            )
          }}
          renderSectionHeader={({ section }) => {
            // adding a gap if are collectionData customData
            if (collectionData.length > 0 && section.title === 'base')
              return <View style={{ marginBottom: 6 }} />
            return null
          }}
        ></SectionList>
        {/* SEE MORE   */}
        <View>
          {onFetchMore && (
            <Button
              label={`Cargar ${onFetchMoreCount || ''} mas`}
              variant="ghost"
              onPress={() => {
                onFetchMore()
              }}
            ></Button>
          )}
        </View>

        {/* PAGINATION */}

        <View
          style={{
            alignSelf: 'center',
            marginBottom: 16,
            marginTop: 4,
            marginRight: 4
          }}
        >
          <Pagination
            currentPage={currentPage}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            totalPages={totalPages}
          />
        </View>
      </View>
    </ScrollView>
  )
}
//#region pin button
const PinButton = ({
  handlePin,
  unpin = false,
  disabled
}: {
  handlePin: () => void
  unpin?: boolean
  disabled?: boolean
}) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => handlePin()}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity: disabled ? 0.4 : 1
      }}
    >
      <Icon
        icon={unpin ? 'unPin' : 'pin'}
        color={unpin ? theme.error : theme.primary}
        size={22}
      />
    </Pressable>
  )
  // return (
  //   <Pressable
  //     disabled={disabled}
  //     icon={unpin ? 'unPin' : 'pin'}
  //     justIcon
  //     onPress={() => handlePin()}
  //
  //     variant="ghost"
  //     size="medium"
  //   />
  // )
}

//#region pagination

const Pagination = ({
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage
}) => {
  if (totalPages <= 1) return null
  return (
    <View style={styles.paginationContainer}>
      <Button
        onPress={handlePrevPage}
        disabled={currentPage === 1}
        label="Prev"
        size="medium"
        icon="rowLeft"
        justIcon
      />
      <Text style={styles.pageText} numberOfLines={1}>
        {currentPage} / {totalPages}
      </Text>
      <Button
        onPress={handleNextPage}
        disabled={currentPage === totalPages}
        label="Next"
        size="medium"
        icon="rowRight"
        justIcon
      />
    </View>
  )
}

//#region styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    width: '100%',
    padding: 2
  },
  orderList: {
    width: '100%'
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
    //marginTop: 4
    // marginRight: 4
  },
  pageText: {
    marginHorizontal: 10,
    fontSize: 16
  }
})
//#region error boundary
export default function <T extends { id: string }>(props: ListPops<T>) {
  return (
    <ErrorBoundary componentName="MyList">
      <MyList {...props}></MyList>
    </ErrorBoundary>
  )
}
//#region error boundary
export const ListE = <T extends { id: string }>(props: ListPops<T>) => {
  if (props?.data === undefined) return <Loading />
  return (
    <ErrorBoundary componentName="MyList">
      <MyList {...props}></MyList>
    </ErrorBoundary>
  )
}
