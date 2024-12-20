import { View, Text } from 'react-native'
import React from 'react'
import { ServiceSections } from '../firebase/ServiceSections'
import { useStore } from '../contexts/storeContext'
import InputCheckbox from './InputCheckbox'
import { gStyles } from '../styles'

const FormEmployeeSections = ({ employeeId }: { employeeId: string }) => {
  const [loading, setLoading] = React.useState(false)
  const { sections: storeSections } = useStore()
  const handleUpdateEmployeeSections = async ({
    sectionId,
    add
  }: {
    sectionId: string
    add: boolean
  }) => {
    setLoading(true)
    try {
      if (add) {
        const res = await ServiceSections.addStaff(sectionId, employeeId)
      } else {
        const res = await ServiceSections.removeStaff(sectionId, employeeId)
      }

      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error({ error })
    }
  }
  return (
    <View>
      {!!storeSections?.length && (
        <>
          <Text style={[gStyles.h3, { textAlign: 'left', marginTop: 12 }]}>
            Areas asignadas
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly'
            }}
          >
            {storeSections?.map(({ name, staff, id }) => (
              <View style={{ margin: 4 }} key={id}>
                <InputCheckbox
                  key={id}
                  disabled={loading}
                  label={name}
                  setValue={(checked) => {
                    handleUpdateEmployeeSections({
                      sectionId: id,
                      add: checked
                    })
                  }}
                  value={staff?.includes(employeeId) || false}
                />
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  )
}

export default FormEmployeeSections
