import * as React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { Button } from '../../../../components';
import { useLanStore } from '../../../../store/form';
import KadgisController from '../../../../store/sqliteDb';
import { useSQLiteContext } from 'expo-sqlite';

const Preview = ({ navigation }: any) => {
  const { land } = useLanStore();
  const db = useSQLiteContext();


  async function handleSave() {
    try {
      const kadgisController = await KadgisController.getInstance(db);
      const result = await kadgisController.addRecord(land);
      navigation.navigate('Home');

      console.log({ result })

    } catch (error) {
      console.log({ error })
    }
    // Handle save action
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flexOne}>
        <ScrollView contentContainerStyle={styles.scrollView}>

          {/* land Information */}
          <View style={styles.card}>
            <Text style={styles.title}>land Details</Text>
            <Text style={styles.label}>Name: <Text style={styles.normalText}>{land.name || 'N/A'}</Text></Text>
            <Text style={styles.label}>Plot Number: <Text style={styles.normalText}>{land.plotNumber || 'N/A'}</Text></Text>
            <Text style={styles.label}>Gender: <Text style={styles.normalText}>{land.gender || 'N/A'}</Text></Text>
            <Text style={styles.label}>Marital Status: <Text style={styles.normalText}>{land.maritalStatus || 'N/A'}</Text></Text>
            <Text style={styles.label}>DOB: <Text style={styles.normalText}>{land.dob || 'N/A'}</Text></Text>
            <Text style={styles.label}>Nationality: <Text style={styles.normalText}>{land.nationality || 'N/A'}</Text></Text>
            <Text style={styles.label}>State of Origin: <Text style={styles.normalText}>{land.stateOfOrigin || 'N/A'}</Text></Text>
            <Text style={styles.label}>LGA: <Text style={styles.normalText}>{land.lga}</Text></Text>
            <Text style={styles.label}>Email: <Text style={styles.normalText}>{land.email || 'N/A'}</Text></Text>
            <Text style={styles.label}>NIN: <Text style={styles.normalText}>{land.nin || 'N/A'}</Text></Text>
            <Text style={styles.label}>BVN: <Text style={styles.normalText}>{land.bvn || 'N/A'}</Text></Text>
            <Text style={styles.label}>Phone Number 1: <Text style={styles.normalText}>{land.phoneNumber1 || 'N/A'}</Text></Text>
            <Text style={styles.label}>Phone Number 2: <Text style={styles.normalText}>{land.phoneNumber2 || 'N/A'}</Text></Text>
            <Text style={styles.label}>Land Size: <Text style={styles.normalText}>{land.landSize || 'N/A'}</Text></Text>
            <Text style={styles.label}>Land Use: <Text style={styles.normalText}>{land.landUse || 'N/A'}</Text></Text>
            <Text style={styles.label}>Land Purpose: <Text style={styles.normalText}>{land.landPurpose || 'N/A'}</Text></Text>
            <Text style={styles.label}>Property Type: <Text style={styles.normalText}>{land.propertyType || 'N/A'}</Text></Text>
            <Text style={styles.label}>BVN: <Text style={styles.normalText}>{land.bvn || 'N/A'}</Text></Text>
            <Text style={styles.label}>Number of Occupants: <Text style={styles.normalText}>{land.numberOfOccupants || 'N/A'}</Text></Text>
            <Text style={styles.label}>Address: <Text style={styles.normalText}>{land.street || 'N/A'}</Text></Text>
            <Text style={styles.label}>Latitude: <Text style={styles.normalText}>{land.latitude || 'N/A'}</Text></Text>
            <Text style={styles.label}>Longitude: <Text style={styles.normalText}>{land.longitude || 'N/A'}</Text></Text>

            {/* Facilities */}
            <View style={styles.facilitiesSection}>
              <Text style={styles.subTitle}>Facilities</Text>
              <Text style={styles.facilityText}>Ablution Area: {land.landSize ? 'Yes' : 'No'}</Text>
              <Text style={styles.facilityText}>Toilet Facilities: {land.landUse ? 'Yes' : 'No'}</Text>
              <Text style={styles.facilityText}>Parking Space: {land.maritalStatus ? 'Yes' : 'No'}</Text>
              <Text style={styles.facilityText}>Women's Prayer Area: {land.street ? 'Yes' : 'No'}</Text>
              <Text style={styles.facilityText}>Security System: {land.propertyOccupancy ? 'Yes' : 'No'}</Text>
              <Text style={styles.facilityText}>Power Supply: {land.phoneNumber2 || 'N/A'}</Text>
              <Text style={styles.facilityText}>Water Supply: {land.nin || 'N/A'}</Text>
            </View>
          </View>

          {/* land Personnel */}
          {/* <View style={styles.card}>
            <Text style={styles.title}>Personnel</Text>
            {land.personnel.length > 0 ? (
              land.personnel.map((person, index) => (
                <View key={index} style={styles.personnelItem}>
                  <Text style={styles.label}>Name: <Text style={styles.normalText}>{person.fullName}</Text></Text>
                  <Text style={styles.label}>Role: <Text style={styles.normalText}>{person.role || 'N/A'}</Text></Text>
                  <Text style={styles.label}>Phone: <Text style={styles.normalText}>{person.phone || 'N/A'}</Text></Text>
                </View>
              ))
            ) : (
              <Text style={styles.normalText}>No personnel data available.</Text>
            )}
          </View> */}


          {/* land Pictures (Rendered in a 3-Column Grid) */}
          <View style={styles.card}>
            <Text style={styles.title}>Pictures</Text>
            <View style={styles.picturesContainer}>
              {land.pictures.length > 0 ? (
                land.pictures.map((picture, index) => (
                  <Image key={index} source={{ uri: picture }} style={styles.picture} />
                ))
              ) : (
                <Text style={styles.normalText}>No pictures available.</Text>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title={'Submit'}
              variant='contained'
              onPress={handleSave}
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
    backgroundColor: '#F9F9F9',
  },
  flexOne: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#003c1e',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#003c1e',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  normalText: {
    fontWeight: '400',
  },
  facilityText: {
    fontSize: 16,
    marginBottom: 4,
  },
  facilitiesSection: {
    marginTop: 16,
  },
  personnelItem: {
    marginBottom: 16,
  },
  madrasaItem: {
    marginBottom: 16,
  },
  picturesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
  },
  picture: {
    width: '30%',
    height: 128,
    marginBottom: 16,
    borderRadius: 12,
    marginHorizontal: 6,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 10,
  },
});

export default Preview;
