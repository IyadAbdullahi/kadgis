import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { z } from 'zod';
import {ExtensibleInput, Button, CustomModal } from '../../../../components';
import { stateList } from '../../../../components/state-list';

// Define the zod schema for location validation
const locationSchema = z.object({
  streetAddress: z.string().min(1, { message: 'Street Address is required' }),
  cityTown: z.string().min(1, { message: 'City/Town is required' }),
  lga: z.string().min(1, { message: 'LGA is required' }),
  state: z.string().min(1, { message: 'State is required' }),
});

const Location = ({ navigation, route }: any) => {
  const [locationData, setLocationData] = useState({
    streetAddress: '',
    cityTown: '',
    lga: '',
    state: '',
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [lgaModalVisible, setLgaModalVisible] = useState(false);


  const states: string[] = stateList.map(item => item.state);

  // Find the LGAs of a specific state
  const getLgasByState = (stateName: string) => {
    const state = stateList.find(state => state.state === stateName);
    return state ? state.lgas : [];
  };

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setLocationData({ ...locationData, [field]: value });
  };

  // Reset error for the specific field
  const resetError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Validate and handle form submission
  const handleSubmit = () => {
    const result = locationSchema.safeParse(locationData);

    if (!result.success) {
      const newErrors: Record<string, string | undefined> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
    } else {
      setErrors({});
      console.log(locationData);

      navigation.navigate('Personel', { locationData });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexOne}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View>
            <Text style={styles.title}>Office Location Information</Text>
            <Text>Enter the office's location information</Text>
            <View style={styles.divider} />

            {/* State Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>State</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => { setStateModalVisible(true); resetError('state'); }}
              >
                <Text>{locationData.state || 'Select State'}</Text>
              </TouchableOpacity>
              {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
            </View>

            {/* LGA Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>LGA</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => { setLgaModalVisible(true); resetError('lga'); }}
                disabled={!locationData.state}
              >
                <Text>{locationData.lga || 'Select LGA'}</Text>
              </TouchableOpacity>
              {errors.lga && <Text style={styles.errorText}>{errors.lga}</Text>}
            </View>

            {/* City/Town Field */}
            <ExtensibleInput
              label='City/Town'
              placeholder='Enter city or town'
              value={locationData.cityTown}
              onChangeText={(text) => handleChange('cityTown', text)}
              error={errors.cityTown}
              onFocus={() => resetError('cityTown')}
            />

            {/* Street Address Field */}
            <ExtensibleInput
              label='Street Address'
              placeholder='Enter street address'
              value={locationData.streetAddress}
              onChangeText={(text) => handleChange('streetAddress', text)}
              multiline
              error={errors.streetAddress}
              onFocus={() => resetError('streetAddress')}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              variant='contained'
              title={'Next'}
              onPress={handleSubmit}
            />
            <Button
              variant='outline'
              title={'Previous'}
              onPress={() => navigation.goBack()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* State Modal */}
      <CustomModal
        visible={stateModalVisible}
        data={states}
        onSelect={(text) => { handleChange('state', text); }}
        onClose={() => setStateModalVisible(false)}
        title="State"
      />

      {/* LGA Modal */}
      <CustomModal
        visible={lgaModalVisible}
        data={getLgasByState(locationData.state) || []}
        onSelect={(text) => handleChange('lga', text)}
        onClose={() => setLgaModalVisible(false)}
        title="LGA"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flexOne: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 24, // Equivalent to 'px-6' (6 * 4)
    paddingVertical: 20, // Equivalent to 'py-5' (5 * 4)
  },
  title: {
    fontSize: 24, // Equivalent to 'text-2xl'
    marginBottom: 16, // Equivalent to 'mb-4'
  },
  divider: {
    marginVertical: 12, // Equivalent to 'my-3'
    height: 1,
    backgroundColor: '#10b98133', // 'bg-primary/20'
  },
  inputGroup: {
    marginBottom: 16, // Equivalent to 'mb-4'
  },
  label: {
    color: '#808080', // Equivalent to 'text-gray-600'
    marginBottom: 8, // Equivalent to 'mb-2'
  },
  selectButton: {
    padding: 16, // Equivalent to 'p-4'
    borderColor: '#D3D3D3', // Equivalent to 'border-gray-300'
    borderWidth: 1,
    borderRadius: 8, // Equivalent to 'rounded-md'
    fontSize: 16, // Equivalent to 'text-base'
  },
  errorText: {
    color: '#FF4C4C', // Equivalent to 'text-red-500'
    marginTop: 4, // Equivalent to 'mt-1'
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 20,
    marginTop: 10,
  },
  nextButton: {
    backgroundColor: '#003c1e', // Equivalent to 'bg-primary'
  },
  prevButton: {
    marginBottom: 32, // Equivalent to 'mb-8'
  },
});

export default Location;
