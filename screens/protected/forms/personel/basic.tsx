import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet, Image, Alert } from 'react-native';
import { z } from 'zod';
import {Button, CustomModal, ExtensibleInput} from '../../../../components';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

// Define the zod schema for form validation
const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  phone: z.string().regex(/^[0-9]{10}$/, { message: 'Invalid phone number' }),
  maritalStatus: z.string().min(1, { message: 'Marital status is required' }),
  height: z.string().min(1, { message: 'Height is required' })
});

const Basic = ({ navigation }: any) => {
  // State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    maritalStatus: '',
    phone: '',
    height: ''
  });
  const [picture, setPicture] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [maritalStatusModal, setMaritalStatusModal] = useState(false);
  const [genderModal, setGenderModal] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (libraryStatus.status !== 'granted' || cameraStatus.status !== 'granted') {
          alert('Sorry, we need camera and media library permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickOrTakeImage = async () => {
    Alert.alert(
      "Select Image",
      "Choose the source of the image",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Camera",
          onPress: async () => {
            let result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
              base64: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
              setPicture(`data:${result.assets[0].mimeType};base64,${result.assets[0].base64}`);
            }
          }
        },
        {
          text: "Gallery",
          onPress: async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
              base64: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
              setPicture(`data:image/jpeg;base64,${result.assets[0].base64}`);
            }
          }
        }
      ]
    );
  };

  const removeImage = () => {
    setPicture(null);
  };

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Reset error for the specific field
  const resetError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

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

      // Convert string fields to numbers where needed
      const preparedData = {
        name: formData.name,
        gender: formData.gender,
        maritalStatus: parseInt(formData.maritalStatus),
        phone: parseInt(formData.phone),
        height: parseInt(formData.height),
      };

      console.log(formData);

      navigation.navigate('Location', { formData: preparedData });
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
                  <Text style={styles.heading}>Basic Information</Text>
                  <Text>Enter the Personel's basic information</Text>
                <View style={styles.divider} />

                {/* User Image */}
            <View style={styles.imageContainer}>
              {picture ? (
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: picture }} style={styles.profileImage} />
                  <TouchableOpacity onPress={removeImage} style={styles.removeImageButton}>
                    <Ionicons name="close" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={pickOrTakeImage} style={styles.imagePlaceholder}>
                  <Image source={require('../../../../assets/profile.png')} style={styles.placeholderImage} />
                </TouchableOpacity>
              )}
            </View>

                  {/* Name Field */}
                  <ExtensibleInput
                      label='Full Name'
                      placeholder='Enter the full name'
                      value={formData.name}
                      onChangeText={(text) => handleChange('name', text)}
                      error={errors.name} // Display error message if present
                      onFocus={() => resetError('name')} // Reset error on focus
                  />

                  {/* Year Established Field */}
                  <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Gender:</Text>
                      <TouchableOpacity
                          style={[styles.selectInput, errors.gender ? styles.errorBorder : styles.defaultBorder]}
                        onPress={() => { setGenderModal(true); resetError('gender') }}
                      >
                          <Text>{formData.gender || 'Select Gender'}</Text>
                      </TouchableOpacity>
                      {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
                  </View>

                  <ExtensibleInput
                    label='Mobile Number'
                    placeholder='Enter the mobile Number'
                    keyboardType='phone-pad'
                    value={formData.phone}
                    onChangeText={(text) => handleChange('phone', text)}
                    error={errors.phone} // Display error message if present
                    onFocus={() => resetError('phone')} // Reset error on focus
                  />

                  {/* Year Established Field */}
                  <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Marital Status:</Text>
                      <TouchableOpacity
                          style={[styles.selectInput, errors.maritalStatus ? styles.errorBorder : styles.defaultBorder]}
                        onPress={() => { setMaritalStatusModal(true); resetError('maritalStatus') }}
                      >
                          <Text>{formData.maritalStatus || 'Select Marital Status'}</Text>
                      </TouchableOpacity>
                      {errors.maritalStatus && <Text style={styles.errorText}>{errors.maritalStatus}</Text>}
                  </View>

                  <ExtensibleInput
                    label='Height (cm)'
                    placeholder='Enter the height'
                    keyboardType='phone-pad'
                    value={formData.height}
                    onChangeText={(text) => handleChange('height', text)}
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
      <CustomModal
        visible={genderModal}
        data={['Male', 'Female']}
        onSelect={(text) => handleChange('gender', text)}
        onClose={() => setGenderModal(false)}
        title="Gender"
      />
      {/* Category Modal */}
      <CustomModal
        visible={maritalStatusModal}
        data={['Single', 'Married', 'Divorced', 'Widowed']}
        onSelect={(text) => handleChange('maritalStatus', text)}
        onClose={() => setMaritalStatusModal(false)}
        title="Marital Status"
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24, // Equivalent to mb-6
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 128, // Equivalent to w-32
    height: 128, // Equivalent to h-32
    borderRadius: 64, // Equivalent to rounded-full
  },
  removeImageButton: {
    position: 'absolute',
    top: 8, // Equivalent to top-2
    right: 8, // Equivalent to right-2
    backgroundColor: '#FF4C4C', // Red for removal button
    width: 32, // Equivalent to w-8
    height: 32, // Equivalent to h-8
    borderRadius: 16, // Rounded button
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 128, // Equivalent to w-32
    height: 128, // Equivalent to h-32
    borderRadius: 64, // Equivalent to rounded-full
    backgroundColor: '#F3F4F6', // Equivalent to bg-gray-100
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16, // Equivalent to mb-4
  },
  placeholderImage: {
    width: 112, // Equivalent to w-28
    height: 112, // Equivalent to h-28
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
