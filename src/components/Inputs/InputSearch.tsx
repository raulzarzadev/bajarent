import { useState, useEffect, useRef } from 'react'
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  Keyboard,
  Pressable
} from 'react-native'
import InputTextStyled from '../InputTextStyled'

export type InputSearchProps<T extends { id: string | number }> = {
  placeholder?: string
  suggestions?: T[]
  labelKey?: keyof T
  maxSuggestions?: number
  onSelect?: (value: T) => void
  onChange?: (value: string) => void
  style?: any
  helperText?: string
  value?: string
  loading?: boolean
}

const InputSearch = <T extends { id: string | number }>({
  placeholder = 'Buscar...',
  suggestions = [],
  labelKey,
  maxSuggestions = 5,
  onSelect,
  onChange,
  style,
  loading,
  helperText,
  value: defaultValue
}: InputSearchProps<T>) => {
  const [value, setValue] = useState(defaultValue || '')
  const [filteredSuggestions, setFilteredSuggestions] = useState<T[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | number | null>(null)
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (!labelKey) return
    if (value.trim()) {
      const filtered = suggestions
        .filter((item) =>
          item[labelKey].toString()?.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, maxSuggestions)
      setFilteredSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [value, suggestions, maxSuggestions, labelKey])

  const handleClearInput = () => {
    setValue('')
    setShowSuggestions(false)
    setHoveredItem(null)
    onChange?.('')
    inputRef.current?.focus()
  }

  const handleInputChange = (newValue: string) => {
    setValue(newValue)
    onChange?.(newValue)
  }

  const handleSuggestionClick = (suggestion: T) => {
    console.log('sugest')
    setValue(suggestion[labelKey]?.toString() || '')
    setShowSuggestions(false)
    setHoveredItem(null)
    onSelect?.(suggestion)
    Keyboard.dismiss()
  }

  const renderSuggestionItem = ({ item }: { item: T }) => {
    const isHovered = hoveredItem === item.id

    return (
      <Pressable
        style={[
          styles.suggestionItem,
          isHovered && styles.suggestionItemHovered,
          { opacity: 0.7 }
        ]}
        onPress={() => handleSuggestionClick(item)}
        // onPressIn={() => setHoveredItem(item.id)}
        // onPressOut={() => setHoveredItem(null)}
      >
        <Text style={styles.suggestionText}>{String(item[labelKey])}</Text>
      </Pressable>
    )
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <InputTextStyled
          ref={inputRef}
          value={value}
          onChangeText={handleInputChange}
          onFocus={() => value.trim() && setShowSuggestions(true)}
          onBlur={() =>
            setTimeout(() => {
              setShowSuggestions(false)
              setHoveredItem(null)
            }, 200)
          }
          leftIcon={
            loading
              ? 'loading'
              : (value.length || value.length) === 0
              ? 'search'
              : 'close'
          }
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          containerStyle={{ flex: 1 }}
          helperText={helperText}
          onPressLeftIcon={() => {
            handleClearInput()
          }}
        />
      </View>

      <View
        style={[
          styles.suggestionsContainer
          // {
          //   display:
          //     !!showSuggestions && filteredSuggestions.length > 0
          //       ? 'flex'
          //       : 'none'
          // }
        ]}
      >
        <FlatList
          data={filteredSuggestions}
          renderItem={renderSuggestionItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          scrollEnabled={filteredSuggestions.length > maxSuggestions - 1}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  iconContainer: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
    padding: 2
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 1001
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  suggestionItemHovered: {
    backgroundColor: '#F3F4F6'
  },
  suggestionText: {
    fontSize: 16,
    color: '#374151'
  }
})

export default InputSearch
