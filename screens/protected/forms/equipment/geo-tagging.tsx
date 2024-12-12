import Icon from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, ScrollView, Text, View, StyleSheet } from 'react-native';
import { z } from 'zod';
import { Button } from '../../../../components';

// Define the Zod schema for geoTaggingData
const geoTaggingSchema = z.object({
  pictures: z.array(z.string()).min(3, { message: "Minimum 3 photos required." }).max(6, { message: "Maximum 6 photos allowed." }),
  latitude: z.number(),
  longitude: z.number(),
});

const GeoTagging = ({ navigation }: any) => {
  const [geoTaggingData, setGeoTaggingData] = useState<{
    pictures: string[];
    latitude: number | null;  // Allow latitude to be null
    longitude: number | null;  // Allow longitude to be null
  }>({
    pictures: [],
    latitude: null,
    longitude: null
  });
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  // Permission for location and camera
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Please grant location permission');
        return;
      }

      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        console.log('Please grant camera permission');
        return;
      }
    })();
  }, []);

  const getLocation = async () => {
    setIsLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      console.log({ location })
      setCurrentLocation(location);
      setGeoTaggingData((prev) => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    if (geoTaggingData.pictures.length >= 6) return;
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setGeoTaggingData((prev) => ({
          ...prev,
          pictures: [...prev.pictures, `data:${result.assets[0].mimeType};base64,${result.assets[0].base64}`],
        }));
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const handleDeletePhoto = (index: number) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDeletePhoto = () => {
    if (deleteIndex !== null) {
      setGeoTaggingData((prev) => ({
        ...prev,
        pictures: prev.pictures.filter((_, idx) => idx !== deleteIndex),
      }));
    }
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const validateForm = (): boolean => {
    try {
      geoTaggingSchema.parse(geoTaggingData);
      setErrors([]);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.errors);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // geoTaggingData.pictures = ''
      console.log({ geoTaggingData })
      navigation.navigate('Preview', { geoTaggingData });
    } else {
      console.log('Form validation failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flexOne}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Geo Tagging Info */}
        <View>

          <View>
            <Text style={styles.coordinatesText}>
            {isLoading ? 'Getting location...' :
            (geoTaggingData.latitude !== null && geoTaggingData.longitude !== null) ?
              `Longitude: ${geoTaggingData.longitude.toFixed(6)} - Latitude: ${geoTaggingData.latitude.toFixed(6)}` :
              'Longitude - Latitude'}
            </Text>
            <Button title={isLoading ? 'Loading...' : 'Get Location'} onPress={getLocation} disabled={isLoading} />
            {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
            {errors.some((e) => e.path.includes("latitude") || e.path.includes("longitude")) && (
              <Text style={styles.errorText}>
                {errors.find((e) => e.path.includes("latitude") || e.path.includes("longitude"))?.message || "Location is required"}
              </Text>
            )}
          </View>

          {/* Pictures Section */}
          <Text style={styles.title}>Pictures of Equipment</Text>
            <Text style={styles.secondaryText}>Take Pictures of the equipment (min 3, max 6)</Text>
          <View style={styles.picturesContainer}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <View key={index} style={styles.pictureWrapper}>
                {index < geoTaggingData.pictures.length ? (
                  <View style={styles.pictureContainer}>
                    <Image source={{ uri: geoTaggingData.pictures[index] }} style={styles.picture} />
                    <Pressable style={styles.deleteButton} onPress={() => handleDeletePhoto(index)}>
                      <Icon name="delete" size={20} color="white" />
                    </Pressable>
                  </View>
                ) : index === geoTaggingData.pictures.length && geoTaggingData.pictures.length < 6 ? (
                  <Pressable style={styles.takePhotoButton} onPress={takePhoto}>
                    <View style={styles.takePhotoContainer}>
                      <Icon name="add-circle-outline" size={40} color={"#1E1E1E"} />
                      <Text style={styles.takePhotoText}>Take Photo</Text>
                    </View>
                  </Pressable>
                ) : null}
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
        {geoTaggingData.pictures.length < 3 || !geoTaggingData.latitude || !geoTaggingData.longitude ? (
            <Text style={styles.errorText}>
              Please provide at least 3 pictures and set the location to continue.
            </Text>
          ) : null}
          <Button
            variant="contained"
            title="Next"
            onPress={handleSubmit}
            disabled={geoTaggingData.pictures.length < 3 || !geoTaggingData.latitude || !geoTaggingData.longitude}
          />
          <Button variant="outline" title="Previous" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>

    {/* Delete Confirmation Modal */}
    <Modal animationType="slide" transparent={true} visible={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Are you sure you want to delete this photo?</Text>
          <View style={styles.modalActions}>
            <Button title="Cancel" onPress={() => setShowDeleteModal(false)} />
            <Button title="Delete" onPress={confirmDeletePhoto} />
          </View>
        </View>
      </View>
    </Modal>
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
    paddingHorizontal: 24, // px-6 equivalent (6 * 4)
    paddingVertical: 20, // py-5 equivalent (5 * 4)
  },
  title: {
    fontSize: 24, // text-2xl equivalent
    marginBottom: 16, // mb-4 equivalent
  },
  secondaryText: {
    color: '#2E2E5D', // text-secondary equivalent
  },
  divider: {
    marginVertical: 12, // my-3 equivalent
    height: 1,
    backgroundColor: '#10b98133', // bg-primary/20 equivalent
  },
  coordinatesText: {
    textAlign: 'center',
    paddingVertical: 12, // py-3 equivalent
    paddingBottom: 20, // pb-5 equivalent
  },
  errorText: {
    color: '#FF4C4C', // text-red-500 equivalent
    marginTop: 8, // mt-2 equivalent
  },
  picturesContainer: {
    paddingVertical: 20, // py-5 equivalent
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pictureWrapper: {
    width: '33.33%', // w-1/3 equivalent
    aspectRatio: 1, // aspect-square equivalent
    padding: 4, // p-1 equivalent
  },
  pictureContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  picture: {
    width: '100%',
    height: '100%',
    borderRadius: 8, // rounded equivalent
  },
  deleteButton: {
    position: 'absolute',
    top: 4, // top-1 equivalent
    right: 4, // right-1 equivalent
    backgroundColor: '#FF4C4C',
    borderRadius: 9999, // rounded-full equivalent
    padding: 4, // p-1 equivalent
  },
  takePhotoButton: {
    width: '100%',
    height: '100%',
  },
  takePhotoContainer: {
    width: '100%',
    height: '100%',
    borderColor: '#D3D3D3', // border-slate-200 equivalent
    borderWidth: 1,
    borderRadius: 8, // rounded equivalent
    justifyContent: 'center',
    alignItems: 'center',
  },
  takePhotoText: {
    fontSize: 12, // text-xs equivalent
  },
  actionButtons: {
    marginTop: 20,
    flexDirection: 'column',
    gap: 10
  },
  nextButton: {
    backgroundColor: '#003c1e', // bg-primary equivalent
  },
  prevButton: {
    marginBottom: 32, // mb-8 equivalent
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // bg-black bg-opacity-50 equivalent
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20, // p-5 equivalent
    borderRadius: 8, // rounded-lg equivalent
  },
  modalTitle: {
    fontSize: 18, // text-lg equivalent
    marginBottom: 12, // mb-3 equivalent
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default GeoTagging;