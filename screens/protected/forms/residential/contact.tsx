import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { z } from 'zod';
import { ExtensibleInput, Button, CustomModal } from '../../../../components';
import { stateList } from '../../../../components/state-list';
import { useLanStore } from '../../../../store/form';

// Define the zod schema for location validation
const contactSchema = z.object({
  phoneNumber1: z.string().min(1, { message: 'You should at least provide one phone number' }),
  email: z.string().min(1, { message: 'Email is required' }),
  street: z.string().min(1, { message: 'Street is required' }),
});

const Contact = ({ navigation, route }: any) => {
  const [contactData, setContactData] = useState({
    phoneNumber1: '',
    phoneNumber2: '',
    email: '',
    street: '',
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const { land, updateLand } = useLanStore();
  console.log(land);



  const states: string[] = stateList.map(item => item.state);

  // Find the LGAs of a specific state
  const getLgasByState = (stateName: string) => {
    const state = stateList.find(state => state.state === stateName);
    return state ? state.lgas : [];
  };

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setContactData({ ...contactData, [field]: value });
  };

  // Reset error for the specific field
  const resetError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Validate and handle form submission
  const handleSubmit = () => {
    const result = contactSchema.safeParse(contactData);

    if (!result.success) {
      const newErrors: Record<string, string | undefined> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
    } else {
      setErrors({});
      console.log(contactData);
      updateLand(result.data)

      navigation.navigate('Personel', { contactData });
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
            <Text style={styles.title}>Owner Contact Information</Text>
            <Text>Enter the Owner Contact Information</Text>
            <View style={styles.divider} />
            {/* Phone 1 Address Field */}
            <ExtensibleInput
              label='Phone Number 1'
              placeholder='Enter Phone Number'
              value={contactData.phoneNumber1}
              onChangeText={(text) => handleChange('phoneNumber1', text)}
              multiline
              error={errors.phoneNumber1}
              onFocus={() => resetError('phoneNumber1')}
            />
            {/* Phone 2 Address Field */}
            <ExtensibleInput
              label='Phone Number 2'
              placeholder='Optional'
              value={contactData.phoneNumber2}
              onChangeText={(text) => handleChange('phoneNumber2', text)}
              multiline
              error={errors.phoneNumber2}
              onFocus={() => resetError('phoneNumber2')}
            />
            {/* Email Address Field */}
            <ExtensibleInput
              label='Email'
              placeholder='Enter email'
              value={contactData.email}
              onChangeText={(text) => handleChange('email', text)}
              multiline
              error={errors.email}
              onFocus={() => resetError('email')}
            />
            {/* Street Address Field */}
            <ExtensibleInput
              label='Street Address'
              placeholder='Enter street address'
              value={contactData.street}
              onChangeText={(text) => handleChange('street', text)}
              multiline
              error={errors.street}
              onFocus={() => resetError('street')}
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

export default Contact;
