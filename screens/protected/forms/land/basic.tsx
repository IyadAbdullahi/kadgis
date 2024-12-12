import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { z } from 'zod';
import { Button, CustomModal, ExtensibleInput } from '../../../../components';

// Define the zod schema for form validation
const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  length: z.number().min(1, { message: 'Length is required' }),
  height: z.number().min(1, { message: 'Height is required' }),
});


const Basic = ({ navigation }: any) => {
  // State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    length: '',
    height: '',
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

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
            <Text style={styles.heading}>Basic Land Information</Text>
            <Text>Enter the land's basic information</Text>
            <View style={styles.divider} />

            {/* Name Field */}
            <ExtensibleInput
              label='Name'
              placeholder='Enter Land name'
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              error={errors.name} // Display error message if present
              onFocus={() => resetError('name')} // Reset error on focus
            />

            {/* Capacity Field */}
            <ExtensibleInput
              label='Length'
              placeholder='Enter the length'
              value={formData.length}
              keyboardType='numeric'
              onChangeText={(text) => handleChange('length', parseInt(text))}
              error={errors.length} // Display error message if present
              onFocus={() => resetError('length')} // Reset error on focus
            />

            <ExtensibleInput
              label='Height'
              placeholder='Enter the height'
              value={formData.height}
              keyboardType='numeric'
              onChangeText={(text) => handleChange('height', parseInt(text))}
              error={errors.height} // Display error message if present
              onFocus={() => resetError('height')} // Reset error on focus
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
