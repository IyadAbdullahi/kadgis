import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Switch, Text, View, StyleSheet } from 'react-native';
import { z } from 'zod';
import {MultiSelectItem, Button} from '../../../../components';

interface Item {
  label: string;
  value: string | number;
}

const powerSupplies: Item[] = [
  { label: 'Grid', value: 'grid' },
  { label: 'Generator', value: 'generator' },
  { label: 'Solar', value: 'solar' },
];

const waterSupplies: Item[] = [
  { label: 'Tap', value: 'tap' },
  { label: 'Borehole', value: 'borehole' },
  { label: 'Well', value: 'well' },
];

// Define the zod schema for maintenance data validation
const maintenanceSchema = z.object({
  toiletFacilities: z.boolean(),
  parkingSpace: z.boolean(),
  securitySystem: z.boolean(),
  powerSupply: z.array(z.string()).min(1, { message: "At least one power supply must be selected" }),
  waterSupply: z.array(z.string()).min(1, { message: "At least one water supply must be selected" }),
});

const Maintenance = ({ navigation }: any) => {
  const [maintenanceData, setMaintenanceData] = useState({
    toiletFacilities: false,
    parkingSpace: false,
    securitySystem: false,
  });

  const [powerSupplyValues, setPowerSupplyValues] = useState<string[]>([]);
  const [waterSupplyValues, setWaterSupplyValues] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});


  const handleSelect = (value: string | number, type: 'power' | 'water') => {
    const setValue = type === 'power' ? setPowerSupplyValues : setWaterSupplyValues;
    const currentValues = type === 'power' ? powerSupplyValues : waterSupplyValues;

    if (currentValues.includes(value.toString())) {
      setValue(currentValues.filter((v) => v !== value.toString()));
    } else {
      setValue([...currentValues, value.toString()]);
    }
    setErrors({});
  };

  // Handle switch changes
  const handleSwitchChange = (field: keyof typeof maintenanceData, value: boolean) => {
    setMaintenanceData({ ...maintenanceData, [field]: value });
  };

  // Validate and handle form submission
  const handleSubmit = () => {
    const dataToValidate = {
      ...maintenanceData,
      powerSupply: powerSupplyValues,
      waterSupply: waterSupplyValues,
    };

    try {
      const validatedData = maintenanceSchema.parse(dataToValidate);
      console.log('Maintenance Data:', dataToValidate);
      navigation.navigate('GeoTagging', { maintenanceData: validatedData });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path.join('.')] = err.message;
          }
        });
        setErrors(newErrors);
        console.log(error);

      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flexOne}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View>
            <Text style={styles.title}>School Maintenance</Text>
            <Text>Enter maintenance details of the School</Text>

            <View style={styles.divider} />

            {/* Facility Information */}
            <Text style={styles.facilitiesTitle}>Surrouding</Text>

            {Object.entries(maintenanceData).map(([key, value]) => (
              <View key={key} style={styles.facilityItem}>
                <Text>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Text>
                <Switch
                  value={value}
                  onValueChange={(newValue) => handleSwitchChange(key as keyof typeof maintenanceData, newValue)}
                  style={Platform.OS === 'ios' ? styles.iosSwitch : styles.androidSwitch}
                />
              </View>
            ))}

            {/* Power Supply Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Power Supply:</Text>
              <View style={styles.multiSelectContainer}>
                {powerSupplies.map((item, index) => (
                  <View key={index} style={styles.multiSelectItem}>
                    <MultiSelectItem
                      label={item.label}
                      value={item.value}
                      selectedValues={powerSupplyValues}
                      onSelect={(value) => handleSelect(value, 'power')}
                    />
                  </View>
                ))}
              </View>
              {errors.powerSupply && <Text style={styles.errorText}>{errors.powerSupply}</Text>}
            </View>

            {/* Water Supply Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Water Supply:</Text>
              <View style={styles.multiSelectContainer}>
                {waterSupplies.map((item, index) => (
                  <View key={index} style={styles.multiSelectItem}>
                    <MultiSelectItem
                      label={item.label}
                      value={item.value}
                      selectedValues={waterSupplyValues}
                      onSelect={(value) => handleSelect(value, 'water')}
                    />
                  </View>
                ))}
              </View>
              {errors.waterSupply && <Text style={styles.errorText}>{errors.waterSupply}</Text>}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title={'Next'}
              variant='contained'
              onPress={handleSubmit}
            />
            <Button
              title={'Previous'}
              variant='outline'
              onPress={() => navigation.goBack()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // bg-white equivalent
  },
  flexOne: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 24, // px-6 equivalent
    paddingVertical: 20, // py-5 equivalent
  },
  title: {
    fontSize: 24, // text-2xl equivalent
    marginBottom: 16, // mb-4 equivalent
  },
  divider: {
    marginVertical: 12, // my-3 equivalent
    height: 1,
    backgroundColor: '#10b98133', // bg-primary/20 equivalent
  },
  facilitiesTitle: {
    fontSize: 18, // text-lg equivalent
    marginBottom: 12, // mb-3 equivalent
  },
  facilityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8, // For consistent spacing between items
  },
  iosSwitch: {
    marginVertical: 4, // my-1 equivalent for iOS
  },
  androidSwitch: {
    marginVertical: 0, // my-0 equivalent for Android
  },
  section: {
    paddingVertical: 8, // py-2 equivalent
  },
  sectionTitle: {
    marginBottom: 16, // mb-4 equivalent
  },
  multiSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  multiSelectItem: {
    marginRight: 8, // mr-2 equivalent
    marginBottom: 8, // mb-2 equivalent
  },
  errorText: {
    color: '#FF4C4C', // text-red-500 equivalent
    marginTop: 8, // mt-1 equivalent
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 10
  },
});

export default Maintenance;