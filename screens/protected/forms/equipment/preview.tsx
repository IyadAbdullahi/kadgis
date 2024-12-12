import * as React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { Button } from '../../../../components';
import { useMosqueStore } from '../../../../store/form';
import MosqueController from '../../../../store/sqliteDb2';
import { useSQLiteContext } from 'expo-sqlite';

const Preview = ({ navigation }: any) => {
  const { mosque } = useMosqueStore();
  const db = useSQLiteContext();


  async function handleSave() {
    try {
      const mosqueController = await MosqueController.getInstance(db);
      const result = await mosqueController.addMosque(mosque);
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

          {/* Mosque Information */}
          <View style={styles.card}>
            <Text style={styles.title}>Mosque Details</Text>
            <Text style={styles.label}>Name: <Text style={styles.normalText}>{mosque.name || 'N/A'}</Text></Text>
            <Text style={styles.label}>Street Address: <Text style={styles.normalText}>{mosque.streetAddress || 'N/A'}</Text></Text>
            <Text style={styles.label}>City/Town: <Text style={styles.normalText}>{mosque.cityTown || 'N/A'}</Text></Text>
            <Text style={styles.label}>LGA: <Text style={styles.normalText}>{mosque.lga || 'N/A'}</Text></Text>
            <Text style={styles.label}>State: <Text style={styles.normalText}>{mosque.state || 'N/A'}</Text></Text>
            <Text style={styles.label}>Latitude: <Text style={styles.normalText}>{mosque.latitude || 'N/A'}</Text></Text>
            <Text style={styles.label}>Longitude: <Text style={styles.normalText}>{mosque.longitude || 'N/A'}</Text></Text>
            <Text style={styles.label}>Category: <Text style={styles.normalText}>{mosque.category}</Text></Text>
            <Text style={styles.label}>Capacity: <Text style={styles.normalText}>{mosque.capacity || 'N/A'}</Text></Text>
            <Text style={styles.label}>Year Established: <Text style={styles.normalText}>{mosque.yearEstablished || 'N/A'}</Text></Text>
            <Text style={styles.label}>Number of Floors: <Text style={styles.normalText}>{mosque.numberOfFloors || 'N/A'}</Text></Text>

            {/* Facilities */}
            <View style={styles.facilitiesSection}>
              <Text style={styles.subTitle}>Facilities</Text>
              <Text style={styles.facilityText}>Ablution Area: {mosque.ablutionArea ? 'Yes' : 'No'}</Text>
              <Text style={styles.facilityText}>Toilet Facilities: {mosque.toiletFacilities ? 'Yes' : 'No'}</Text>
              <Text style={styles.facilityText}>Parking Space: {mosque.parkingSpace ? 'Yes' : 'No'}</Text>
              <Text style={styles.facilityText}>Women's Prayer Area: {mosque.womensPrayerArea ? 'Yes' : 'No'}</Text>
              <Text style={styles.facilityText}>Security System: {mosque.securitySystem ? 'Yes' : 'No'}</Text>
              <Text style={styles.facilityText}>Power Supply: {mosque.powerSupply || 'N/A'}</Text>
              <Text style={styles.facilityText}>Water Supply: {mosque.waterSupply || 'N/A'}</Text>
            </View>
          </View>

          {/* Mosque Personnel */}
          <View style={styles.card}>
            <Text style={styles.title}>Personnel</Text>
            {mosque.personnel.length > 0 ? (
              mosque.personnel.map((person, index) => (
                <View key={index} style={styles.personnelItem}>
                  <Text style={styles.label}>Name: <Text style={styles.normalText}>{person.fullName}</Text></Text>
                  <Text style={styles.label}>Role: <Text style={styles.normalText}>{person.role || 'N/A'}</Text></Text>
                  <Text style={styles.label}>Phone: <Text style={styles.normalText}>{person.phone || 'N/A'}</Text></Text>
                </View>
              ))
            ) : (
              <Text style={styles.normalText}>No personnel data available.</Text>
            )}
          </View>

          {/* Mosque Madrasas */}
          <View style={styles.card}>
            <Text style={styles.title}>Madrasas</Text>
            {mosque.madrasas.length > 0 ? (
              mosque.madrasas.map((madrasa, index) => (
                <View key={index} style={styles.madrasaItem}>
                  <Text style={styles.label}>Name: <Text style={styles.normalText}>{madrasa.name}</Text></Text>
                  <Text style={styles.label}>Type: <Text style={styles.normalText}>{madrasa.type}</Text></Text>
                  <Text style={styles.label}>Address: <Text style={styles.normalText}>{madrasa.address}</Text></Text>
                  <Text style={styles.label}>Total Students: <Text style={styles.normalText}>{madrasa.totalStudents}</Text></Text>
                  <Text style={styles.label}>Contact Person: <Text style={styles.normalText}>{madrasa.contactPerson.name} ({madrasa.contactPerson.position})</Text></Text>
                  <Text style={styles.label}>Phone: <Text style={styles.normalText}>{madrasa.contactPerson.phone}</Text></Text>
                </View>
              ))
            ) : (
              <Text style={styles.normalText}>No madrasa data available.</Text>
            )}
          </View>

          {/* Mosque Pictures (Rendered in a 3-Column Grid) */}
          <View style={styles.card}>
            <Text style={styles.title}>Pictures</Text>
            <View style={styles.picturesContainer}>
              {mosque.pictures.length > 0 ? (
                mosque.pictures.map((picture, index) => (
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
