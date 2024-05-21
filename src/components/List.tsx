import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
  //   Dimensions
} from 'react-native'
import useSort from '../hooks/useSort'
import { FC, useState } from 'react'
import Icon, { IconName } from './Icon'

import ErrorBoundary from './ErrorBoundary'
import ModalFilterList, {
  CollectionSearch,
  FilterListType
} from './ModalFilterList'
import Button from './Button'
import InputCheckbox from './InputCheckbox'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import Loading from './Loading'

// const windowHeight = Dimensions.get('window').height
// const maxHeight = windowHeight - 110 //* this is the height of the bottom tab

export type ListSideButton = {
  icon: IconName
  label: string
  onPress: () => void
  visible?: boolean
  disabled?: boolean
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
  collectionSearch
}: ListPops<T>) {
  const [filteredData, setFilteredData] = useState<T[]>([])

  const { sortBy, order, sortedBy, sortedData, changeOrder } = useSort<T>({
    data: filteredData,
    defaultSortBy: defaultSortBy as string,
    defaultOrder
  })

  //* pagination
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(sortedData.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, sortedData.length)

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const [multiSelect, setMultiSelect] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const handleMultiSelect = () => {
    setMultiSelect(!multiSelect)
    if (!multiSelect) setSelectedRows([])
  }
  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const [selectAll, setSelectAll] = useState(false)
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([])
    } else {
      setSelectedRows(sortedData.map((row) => row.id))
    }
    setSelectAll(!selectAll)
  }

  const multiSelectActionsModal = useModal({ title: 'Acciones' })
  const [loading, setLoading] = useState(false)
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ margin: 'auto', maxWidth: '100%' }}>
        <View>
          {/* SEARCH FILTER AND SIDE BUTTONS   */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
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
                      size="small"
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
                setLoading(true)
                setTimeout(() => {
                  setCurrentPage(1)
                  setFilteredData(data)
                  setLoading(false)
                }, 1000)
              }}
              filters={filters}
            />
          </View>

          {/* COINCIDENT AND PAGINATION */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              {multiSelect && selectedRows?.length > 0 && (
                <>
                  <Button
                    icon="settings"
                    justIcon
                    onPress={() => {
                      multiSelectActionsModal.toggleOpen()
                    }}
                    variant="ghost"
                  ></Button>
                  <StyledModal {...multiSelectActionsModal}>
                    <ComponentMultiActions ids={selectedRows} />
                  </StyledModal>
                </>
              )}
              {ComponentMultiActions && (
                <Button
                  label={
                    multiSelect
                      ? `${selectedRows.length || 0} Seleccionadas `
                      : 'Seleccionar'
                  }
                  variant={'ghost'}
                  size="xs"
                  onPress={() => {
                    handleMultiSelect()
                  }}
                ></Button>
              )}
            </View>
            <Text style={{ textAlign: 'center', marginRight: 4 }}>
              {filteredData.length} coincidencias
            </Text>
            <Pagination
              currentPage={currentPage}
              handleNextPage={handleNextPage}
              handlePrevPage={handlePrevPage}
              totalPages={totalPages}
            />
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
              style={
                {
                  // width: '100%',
                  // maxWidth: 600,
                  // margin: 'auto'
                }
              }
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
        {/* TABLA OF CONTENT   */}
        {multiSelect && (
          <View style={{ alignSelf: 'flex-start' }}>
            <InputCheckbox
              value={selectAll}
              setValue={handleSelectAll}
              label="Todas"
            />
          </View>
        )}
        {loading && <Loading />}
        {!loading && (
          <>
            <FlatList
              data={sortedData.slice(startIndex, endIndex)}
              renderItem={({ item }) => {
                return (
                  <>
                    <View style={{ flexDirection: 'row' }}>
                      {multiSelect && (
                        <InputCheckbox
                          label=""
                          setValue={() => {
                            handleSelectRow(item?.id)
                          }}
                          value={selectedRows.includes(item?.id)}
                        />
                      )}
                      <Pressable
                        style={{ flex: 1 }}
                        onPress={() => {
                          if (multiSelect) {
                            handleSelectRow(item.id)
                          } else {
                            onPressRow && onPressRow(item?.id)
                          }
                        }}
                      >
                        <ComponentRow item={item} />
                      </Pressable>
                    </View>
                  </>
                )
              }}
            ></FlatList>

            <View
              style={{
                alignSelf: 'flex-end',
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
          </>
        )}
      </View>
    </ScrollView>
  )
}

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
        size="small"
        icon="rowLeft"
        justIcon
      />
      <Text style={styles.pageText}>
        {currentPage} de {totalPages}
      </Text>
      <Button
        onPress={handleNextPage}
        disabled={currentPage === totalPages}
        label="Next"
        size="small"
        icon="rowRight"
        justIcon
      />
    </View>
  )
}

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

    // paddingHorizontal: 4
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

export default function <T extends { id: string }>(props: ListPops<T>) {
  return (
    <ErrorBoundary componentName="MyList">
      <MyList {...props}></MyList>
    </ErrorBoundary>
  )
}
