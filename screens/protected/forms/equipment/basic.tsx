import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { z } from 'zod';
import { Button, CustomModal, ExtensibleInput } from '../../../../components';

// Define the zod schema for form validation
const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  serialNumber: z.string().min(1, { message: 'Serial Number is required' }),
  type: z.string().min(1, { message: 'Type is required' }),
  manufacturer: z.string().min(1, { message: 'Manufacturer is required' }),
  yearOfManufacture: z.string().min(1, { message: 'Year is required' }),
  dateOfProcurement: z.string().min(1, { message: 'Date is required' }),
  purchasePrice: z.string(),
  currentValue: z.string(),
  condition: z.string(),
});


const Basic = ({ navigation }: any) => {
  // State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    type: '',
    manufacturer: '',
    yearOfManufacture: '',
    dateOfProcurement: '',
    purchasePrice: '',
    currentValue: '',
    condition: '',
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [conditionModalVisible, setConditionModalVisible] = useState(false);

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
      });
      setErrors(newErrors);
    } else {
      setErrors({});
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
            <Text style={styles.heading}>Basic Equipment Information</Text>
            <Text>Enter the equipment's basic information</Text>
            <View style={styles.divider} />

            {/* Name Field */}
            <ExtensibleInput
              label='Name'
              placeholder='Enter of the equipment'
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              error={errors.name} // Display error message if present
              onFocus={() => resetError('name')} // Reset error on focus
            />

            {/* Capacity Field */}
            <ExtensibleInput
              label='Serial Number'
              placeholder='Enter Serial Number'
              value={formData.serialNumber}
              onChangeText={(text) => handleChange('serialNumber', text)}
              error={errors.serialNumber} // Display error message if present
              onFocus={() => resetError('serialNumber')} // Reset error on focus
            />

            <ExtensibleInput
              label='Model/Type'
              placeholder='Enter Model or Type'
              value={formData.type}
              onChangeText={(text) => handleChange('type', text)}
              error={errors.type} // Display error message if present
              onFocus={() => resetError('type')} // Reset error on focus
            />

            <ExtensibleInput
              label='Manufacturer'
              placeholder='Enter the Manufacturer'
              value={formData.manufacturer}
              onChangeText={(text) => handleChange('manufacturer', text)}
              error={errors.manufacturer} // Display error message if present
              onFocus={() => resetError('manufacturer')} // Reset error on focus
            />

            {/* Year Established Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Year of Manufacture</Text>
              <TouchableOpacity
                style={[styles.selectInput, errors.yearEstablished ? styles.errorBorder : styles.defaultBorder]}
                onPress={() => {
                  setYearModalVisible(true);
                  resetError('yearOfManufacture')
                }}
              >
                <Text>{formData.yearOfManufacture || 'Select Year of Establishment'}</Text>
              </TouchableOpacity>
              {errors.yearOfManufacture && <Text style={styles.errorText}>{errors.yearOfManufacture}</Text>}
            </View>

            <ExtensibleInput
              label='Date of Procurement'
              placeholder='Enter Date'
              value={formData.dateOfProcurement}
              onChangeText={(text) => handleChange('dateOfProcurement', text)}
              error={errors.dateOfProcurement} // Display error message if present
              onFocus={() => resetError('dateOfProcurement')} // Reset error on focus
            />

            <ExtensibleInput
              label='Purchase Price'
              placeholder='Enter the Price'
              value={formData.purchasePrice}
              keyboardType='numeric'
              onChangeText={(text) => handleChange('purchasePrice', text)}
              error={errors.purchasePrice} // Display error message if present
              onFocus={() => resetError('purchasePrice')} // Reset error on focus
          />

            <ExtensibleInput
              label='Current Value'
              placeholder='Enter Price'
              value={formData.currentValue}
              keyboardType='numeric'
              onChangeText={(text) => handleChange('currentValue', text)}
              error={errors.currentValue} // Display error message if present
              onFocus={() => resetError('currentValue')} // Reset error on focus
            />

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Condition</Text>
              <TouchableOpacity
                style={[styles.selectInput, errors.condition ? styles.errorBorder : styles.defaultBorder]}
                onPress={() => {
                  setConditionModalVisible(true);
                  resetError('condition')
                }}
              >
                <Text>{formData.condition|| 'Select Condition'}</Text>
              </TouchableOpacity>
              {errors.condition && <Text style={styles.errorText}>{errors.condition}</Text>}
            </View>
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

      {/* Year Modal */}
      <CustomModal
        visible={yearModalVisible}
        data={years}
        onSelect={(text) => handleChange('yearOfManufacture', text)}
        onClose={() => setYearModalVisible(false)}
        title="Year of Manufacture"
      />

      <CustomModal
        visible={conditionModalVisible}
        data={['New', 'Good', 'Needs Repair']}
        onSelect={(text) => handleChange('condition', text)}
        onClose={() => setConditionModalVisible(false)}
        title="Select Condition"
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
});

export default Basic;
