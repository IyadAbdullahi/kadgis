import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { z } from 'zod';
import { Button, CustomModal, ExtensibleInput } from '../../../../components';

// Define the zod schema for form validation
const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  yearEstablished: z.string().min(1, { message: 'Year Established is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  numberOfFloors: z.number(),
  totalStudents: z.number().min(1, {message: 'Number of Student is required'}),
});


const Basic = ({ navigation }: any) => {
  // State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    yearEstablished: '',
    category: '',
    numberOfFloors: '',
    totalStudents: ''
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);


  // Years data for dropdown
  const years: string[] = [];
  const currentYear = new Date().getFullYear();
  for (let date = currentYear; date >= 1900; date--) {
    years.push(`${date}`);
  }

  // Handle input changes
  const handleChange = (field: any, value: any) => {
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
      console.log(result);
      navigation.navigate('Location', { result });
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
            <Text style={styles.heading}>School Information</Text>
            <Text>Enter the school's basic information</Text>
            <View style={styles.divider} />

            {/* Name Field */}
            <ExtensibleInput
              label='School Name'
              placeholder='Enter the School name'
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              error={errors.name} // Display error message if present
              onFocus={() => resetError('name')} // Reset error on focus
            />

            {/* Year Established Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Year Established</Text>
              <TouchableOpacity
                style={[styles.selectInput, errors.yearEstablished ? styles.errorBorder : styles.defaultBorder]}
                onPress={() => { setYearModalVisible(true); resetError('yearEstablished') }}
              >
                <Text>{formData.yearEstablished || 'Select Year of Establishment'}</Text>
              </TouchableOpacity>
              {errors.yearEstablished && <Text style={styles.errorText}>{errors.yearEstablished}</Text>}
            </View>

            {/* Category Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                style={[styles.selectInput, errors.category ? styles.errorBorder : styles.defaultBorder]}
                onPress={() => { setCategoryModalVisible(true); resetError('category') }}
              >
                <Text>{formData.category || 'Select Category'}</Text>
              </TouchableOpacity>
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            </View>
          </View>

          <ExtensibleInput
            label='Total number of students'
            placeholder='Enter total number'
            value={formData.totalStudents}
            keyboardType='numeric'
            onChangeText={(text) => handleChange('totalStudents', parseInt(text))}
            error={errors.totalStudents} // Display error message if present
            onFocus={() => resetError('totalStudents')} // Reset error on focus
          />


          <ExtensibleInput
            label='Number of Floors'
            placeholder='Enter number of floors'
            value={formData.numberOfFloors}
            keyboardType='numeric'
            onChangeText={(text) => handleChange('numberOfFloors', parseInt(text))}
            error={errors.numberOfFloors} // Display error message if present
            onFocus={() => resetError('numberOfFloors')} // Reset error on focus
          />

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
        onSelect={(text) => handleChange('yearEstablished', text)}
        onClose={() => setYearModalVisible(false)}
        title="Year of Establishment"
      />

      {/* Category Modal */}
      <CustomModal
        visible={categoryModalVisible}
        data={['Primary', 'Secondary', 'Islamiya']}
        onSelect={(text) => handleChange('category', text)}
        onClose={() => setCategoryModalVisible(false)}
        title="Category"
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
