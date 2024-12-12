import React, { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CustomModal, ExtensibleInput } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components';
import { stateList } from '../../components/state-list';
import { z } from 'zod';
import { useActivityStore } from '../../store/activity';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../../apis';


const registerSchema = z.object({
  fullName: z.string().min(5, { message: 'Name is required' }),
  email: z.string().email(),
  password: z.string().min(6).max(15),
  phone: z.string(),
  lga: z.string(),
});

const Register: React.FC = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    state: '',
    lga: '',
    password: '',
  });
  const [picture, setPicture] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [lgaModalVisible, setLgaModalVisible] = useState(false);
  const { showLoader, hideLoader, showSnack } = useActivityStore();


  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'state' && { lga: '' }) // Reset LGA when state changes
    }));
    if (errors[field]) resetError(field);
  };

  const resetError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const states: string[] = stateList.map(item => item.state);

  const getLgasByState = (stateName: string) => {
    const state = stateList.find(state => state.state === stateName);
    return state ? state.lgas : [];
  };

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

  const { mutate, isPending } = useMutation({
    mutationFn: apiService.verifyEmail,
    onSuccess: () => {
      hideLoader();
      navigation.navigate('ConfirmRegister', { formData: { ...formData, picture } });
    },
    onError: (error) => {
      showSnack(error.message, 'danger');
      console.log(error);

      hideLoader();
    },
  });

  const handleRegister = () => {
    console.log('hello');

    const result = registerSchema.safeParse(formData);
    console.log(result);

    if (!result.success) {
      const newErrors: Record<string, string | undefined> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      showSnack("All fields are required", 'danger');
    } else {
      setErrors({});
      showLoader()
      mutate({ email: formData.email })
      navigation.navigate('ConfirmRegister', formData);
    }
  }

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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.innerContainer}>
            {/* Logo and Header */}
            <View style={styles.logoContainer}>
              <Image source={require('../../assets/kadgis_logo.png')} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.headerText}>Register an Account</Text>
            <Text style={styles.descriptionText}>
              By entering your details you agree with our terms and conditions and privacy policies
            </Text>
            <View style={styles.separator} />

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
                  <Image source={require('../../assets/profile.png')} style={styles.placeholderImage} />
                </TouchableOpacity>
              )}
            </View>

            {/* Form Fields */}
            <ExtensibleInput
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) => handleChange('fullName', text)}
              error={errors.fullName}
            />
            <ExtensibleInput
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              error={errors.email}
            />
            <ExtensibleInput
              label="Phone"
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              error={errors.phone}
            />

            {/* State and LGA Selectors */}
            <View style={styles.selectorContainer}>
              <Text style={styles.selectorLabel}>State</Text>
              <TouchableOpacity style={styles.selectorButton} onPress={() => setStateModalVisible(true)}>
                <Text>{formData.state || 'Select State'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.selectorContainer}>
              <Text style={styles.selectorLabel}>LGA</Text>
              <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setLgaModalVisible(true)}
                disabled={!formData.state}>
                <Text>{formData.lga || 'Select LGA'}</Text>
              </TouchableOpacity>
            </View>

            <ExtensibleInput
              label="Password"
              secureTextEntry
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              error={errors.password}
            />

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button variant="contained" title="Register" onPress={handleRegister} />
              <Button variant="outline" title="Back to Login" onPress={() => navigation.navigate('Login')} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* State Modal */}
      <CustomModal
        visible={stateModalVisible}
        data={states}
        onSelect={(selectedState) => {
          handleChange('state', selectedState);
          setStateModalVisible(false);
        }}
        onClose={() => setStateModalVisible(false)}
        title="State"
      />

      {/* LGA Modal */}
      <CustomModal
        visible={lgaModalVisible}
        data={getLgasByState(formData.state)}
        onSelect={(selectedLga) => {
          handleChange('lga', selectedLga);
          setLgaModalVisible(false);
        }}
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
  keyboardAvoidingView: {
    flex: 1,
    marginTop: 12, // Equivalent to mt-3
  },
  scrollView: {
    flexGrow: 1,
  },
  innerContainer: {
    padding: 24, // Equivalent to p-6
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32, // Equivalent to mb-8
  },
  logo: {
    width: 144, // Equivalent to w-36
    height: 112, // Equivalent to h-28
  },
  headerText: {
    fontSize: 24, // Equivalent to text-2xl
    fontWeight: 'bold',
    marginBottom: 16, // Equivalent to mb-4
  },
  descriptionText: {
    marginBottom: 16, // Equivalent to mb-4
  },
  separator: {
    height: 1, // Equivalent to h-px
    backgroundColor: '#E5E7EB', // Equivalent to bg-gray-200
    marginVertical: 16, // Equivalent to my-4
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
  selectorContainer: {
    marginBottom: 16, // Equivalent to mb-4
  },
  selectorLabel: {
    color: '#6B7280', // Equivalent to text-gray-600
    marginBottom: 8, // Equivalent to mb-2
  },
  selectorButton: {
    padding: 16, // Equivalent to p-4
    borderWidth: 1,
    borderColor: '#D1D5DB', // Equivalent to border-gray-300
    borderRadius: 8, // Equivalent to rounded-lg
  },
  buttonContainer: {
    marginTop: 20, // Equivalent to mt-6
    flexDirection: 'column',
    gap: 20,
  },
  primaryButton: {
    marginBottom: 16, // Equivalent to mb-4
  },
  outlineButton: {
    marginTop: 8, // Equivalent to mt-2
  },
});

export default Register;