import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Switch, Text, View, StyleSheet } from 'react-native';
import { z } from 'zod';
import {MultiSelectItem, Button} from '../../../../components';

// Define the zod schema for maintenance data validation
const maintenanceSchema = z.object({
  warrantyStatus: z.boolean(),
  insuranceStatus: z.boolean(),
  maintenanceSchedule: z.string(),
  warrantyExpiryDate: z.string(),
  insuranceProvider: z.string(),
  lastServiceDate: z.string(),
  nextServiceDue: z.string(),
});

const Maintenance = ({ navigation }: any) => {
  const [maintenanceData, setMaintenanceData] = useState({
    warrantyStatus: false,
    insuranceStatus: false,
    maintenanceSchedule: '',
    warrantyExpiryDate: '',
    insuranceProvider: '',
    lastServiceDate: '',
    nextServiceDue: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle switch changes
  const handleSwitchChange = (field: keyof typeof maintenanceData, value: boolean) => {
    setMaintenanceData({ ...maintenanceData, [field]: value });
  };

  // Validate and handle form submission
  const handleSubmit = () => {
    navigation.navigate('GeoTagging');
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flexOne}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View>
            <Text style={styles.title}>Maintenance Information</Text>
            <Text>Enter maintenance & Warranty of Equipments</Text>
            <View style={styles.divider} />

            {/* Facility Information */}
            <Text style={styles.facilitiesTitle}>Maintainance</Text>

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

            <View style={styles.section}>

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