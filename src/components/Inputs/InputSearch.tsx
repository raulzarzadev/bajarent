import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  Keyboard
} from 'react-native'

type InputSearchProps<T extends { id: string | number }> = {
  placeholder?: string
  suggestions?: T[]
  labelKey: keyof T
  maxSuggestions?: number
  onSelect?: (value: T) => void
  onChange?: (value: string) => void
  style?: any
}

const InputSearch = <T extends { id: string | number }>({
  placeholder = 'Buscar...',
  suggestions = [],
  labelKey,
  maxSuggestions = 5,
  onSelect,
  onChange,
  style
}: InputSearchProps<T>) => {
  const [value, setValue] = useState('')
  const [filteredSuggestions, setFilteredSuggestions] = useState<T[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | number | null>(null)
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
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

  const handleInputChange = (newValue: string) => {
    setValue(newValue)
    onChange?.(newValue)
  }

  const handleSuggestionClick = (suggestion: T) => {
    setValue(suggestion[labelKey]?.toString() || '')
    setShowSuggestions(false)
    setHoveredItem(null)
    onSelect?.(suggestion)
    Keyboard.dismiss()
  }

  const renderSuggestionItem = ({ item }: { item: T }) => {
    const isHovered = hoveredItem === item.id

    return (
      <TouchableOpacity
        style={[
          styles.suggestionItem,
          isHovered && styles.suggestionItemHovered
        ]}
        onPress={() => handleSuggestionClick(item)}
        onPressIn={() => setHoveredItem(item.id)}
        onPressOut={() => setHoveredItem(null)}
        activeOpacity={0.7}
      >
        <Text style={styles.suggestionText}>{String(item[labelKey])}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, style]}>
      <TextInput
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
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor="#9CA3AF"
      />

      {showSuggestions && filteredSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={filteredSuggestions}
            renderItem={renderSuggestionItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            scrollEnabled={filteredSuggestions.length > maxSuggestions - 1}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000
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
