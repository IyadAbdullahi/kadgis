import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { z } from 'zod';
import { Button, CustomModal, ExtensibleInput } from '../../../../components';
import { useLanStore } from '../../../../store/form';
import { stateList } from '../../../../components/state-list';
import DOBPicker from '../../../../components/DOBPicker';



// Define the zod schema for form validation
const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  dob: z.string().min(1, { message: 'DOB is required' }),
  nationality: z.string().min(1, { message: 'Nationality is required' }),
  stateOfOrigin: z.string().min(1, { message: 'State is required' }),
  lga: z.string().min(1, { message: 'LGA is required' }),
  maritalStatus: z.string().min(1, { message: 'Marital Status is required' }),
  nin: z.string().min(11, { message: 'NIN is required' }).max(11, { message: 'NIN must not exceed 11 digit' }),
  bvn: z.string().min(11, { message: 'BVN is required' }).max(11, { message: 'BVN must not exceed 11 digit' }),
});


const Owner = ({ navigation }: any) => {
  // State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dob: '',
    nationality: '',
    stateOfOrigin: '',
    lga: '',
    maritalStatus: '',
    nin: '',
    bvn: ''
  });





  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [nationalityModalVisible, setNationalityModalVisible] = useState(false);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [lgaModalVisible, setLgaModalVisible] = useState(false);
  const [maritalStatusModalVisible, setMaritalStatusModalVisible] = useState(false);
  const { land, updateLand } = useLanStore();
  console.log({ ...land });


  const states: string[] = stateList.map(item => item.state);
  // Find the LGAs of a specific state
  const getLgasByState = (stateName: string) => {
    const state = stateList.find(state => state.state === stateName);
    return state ? state.lgas : [];
  };


  // Years data for dropdown
  const years: string[] = [];
  const currentYear = new Date().getFullYear();
  for (let date = currentYear; date >= 1900; date--) {
    years.push(`${date}`);
  }

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });


  };

  // Reset error for the specific field
  const resetError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Validate and handle form submission
  // Validate and handle form submission
  const handleSubmit = () => {
    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string | undefined> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
        console.log('error');

      });
      setErrors(newErrors);
    } else {
      setErrors({});
      updateLand(result.data)
      navigation.navigate('Location');
    }
  };



  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View>
            <Text style={styles.heading}>Owner Information</Text>
            <Text>Enter the owner information</Text>
            <View style={styles.divider} />

            {/* Name Field */}
            <ExtensibleInput
              label='Name'
              placeholder='Enter Owner Name'
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              error={errors.name} // Display error message if present
              onFocus={() => resetError('name')} // Reset error on focus
            />

            {/* DOB Field */}
            <DOBPicker
              onDateSelect={(date) => { handleChange('dob', date); resetError('dob') }}
              onErrors={errors.dob}
            />

            {/* Gender Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Gender</Text>
              <TouchableOpacity
                style={[styles.selectInput, errors.dob ? styles.errorBorder : styles.defaultBorder]}
                onPress={() => { setGenderModalVisible(true); resetError('nationality') }}
              >
                <Text>{formData.gender || 'Select Gender'}</Text>
              </TouchableOpacity>
              {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
            </View>
            {/* Nationality Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nationality</Text>
              <TouchableOpacity
                style={[styles.selectInput, errors.nationality ? styles.errorBorder : styles.defaultBorder]}
                onPress={() => { setNationalityModalVisible(true); resetError('nationality') }}
              >
                <Text>{formData.nationality || 'Select Nationality'}</Text>
              </TouchableOpacity>
              {errors.nationality && <Text style={styles.errorText}>{errors.nationality}</Text>}
            </View>


            {/* State Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>State of Origin</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => { setStateModalVisible(true); resetError('sateOfOrigin'); }}
              >
                <Text>{formData.stateOfOrigin || 'Select State of Origin'}</Text>
              </TouchableOpacity>
              {errors.stateOfOrigin && <Text style={styles.errorText}>{errors.stateOfOrigin}</Text>}
            </View>

            {/* LGA Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>LGA</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => { setLgaModalVisible(true); resetError('lga'); }}
                disabled={!formData.stateOfOrigin}
              >
                <Text>{formData.lga || 'Select LGA'}</Text>
              </TouchableOpacity>
              {errors.lga && <Text style={styles.errorText}>{errors.lga}</Text>}
            </View>

            {/* Marital Status Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Marital Status</Text>
              <TouchableOpacity
                style={[styles.selectInput, errors.maritalStatus ? styles.errorBorder : styles.defaultBorder]}
                onPress={() => { setMaritalStatusModalVisible(true); resetError('maritalStatus') }}
              >
                <Text>{formData.maritalStatus || 'Select MaritalStatus'}</Text>
              </TouchableOpacity>
              {errors.maritalStatus && <Text style={styles.errorText}>{errors.maritalStatus}</Text>}
            </View>

            {/* NIN Field */}
            <ExtensibleInput
              label='NIN'
              placeholder='Enter NIN'
              value={formData.nin}
              onChangeText={(text) => handleChange('nin', text)}
              error={errors.nin} // Display error message if present
              onFocus={() => resetError('nin')} // Reset error on focus
            />
            {/* BVN Field */}
            <ExtensibleInput
              label='BVN'
              placeholder='Enter BVN'
              value={formData.bvn}
              onChangeText={(text) => handleChange('bvn', text)}
              error={errors.bvn} // Display error message if present
              onFocus={() => resetError('bvn')} // Reset error on focus
            />

          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              variant='contained'
              title={'Next'}
              onPress={handleSubmit} // Validate form on submit
            />
            <Button
              variant='outline'
              title={'Cancel'}
              onPress={() => navigation.goBack()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Gender Modal */}
      <CustomModal
        visible={genderModalVisible}
        data={['Male', 'Female']}
        onSelect={(text) => handleChange('gender', text)}
        onClose={() => setGenderModalVisible(false)}
        title="Gender"
      />

      {/* Nationality Modal */}
      <CustomModal
        visible={nationalityModalVisible}
        data={['Nigerian', 'Other']}
        onSelect={(text) => handleChange('nationality', text)}
        onClose={() => setNationalityModalVisible(false)}
        title="Nationality"
      />
      {/* Marital Modal */}
      <CustomModal
        visible={maritalStatusModalVisible}
        data={['Single', 'Married']}
        onSelect={(text) => handleChange('maritalStatus', text)}
        onClose={() => setMaritalStatusModalVisible(false)}
        title="Marital Status"
      />

      {/* State Modal */}
      <CustomModal
        visible={stateModalVisible}
        data={states}
        onSelect={(text) => { handleChange('stateOfOrigin', text); }}
        onClose={() => setStateModalVisible(false)}
        title="State"
      />

      {/* LGA Modal */}
      <CustomModal
        visible={lgaModalVisible}
        data={getLgasByState(formData.stateOfOrigin) || []}
        onSelect={(text) => handleChange('lga', text)}
        onClose={() => setLgaModalVisible(false)}
        title="LGA"
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  heading: {
    fontSize: 24,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 12,
    flex: 1,
    height: 1,
    backgroundColor: '#003c1e20', // Primary color with opacity
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#4B5563', // Gray-600
    marginBottom: 8,
  },
  selectInput: {
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  defaultBorder: {
    borderColor: '#D1D5DB', // Gray-300
    borderWidth: 1,
  },
  errorBorder: {
    borderColor: '#FF4C4C', // Danger red color for error
    borderWidth: 1,
  },
  errorText: {
    color: '#FF4C4C', // Danger red color for error text
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 20,
    marginTop: 10,
  },
  nextButton: {
    backgroundColor: '#003c1e', // Primary color
    marginTop: 20,
  },
  cancelButton: {
    marginBottom: 20,
  },
  selectButton: {
    padding: 16, // Equivalent to 'p-4'
    borderColor: '#D3D3D3', // Equivalent to 'border-gray-300'
    borderWidth: 1,
    borderRadius: 8, // Equivalent to 'rounded-md'
    fontSize: 16, // Equivalent to 'text-base'
  },
  inputGroup: {
    marginBottom: 16, // Equivalent to 'mb-4'
  },
});

export default Owner;
