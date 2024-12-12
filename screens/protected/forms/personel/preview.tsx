import * as React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { Button } from '../../../../components';

const Preview = ({ navigation, route }: any) => {
  function handleSave() {
    console.log(route.params);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flexOne}>
        <ScrollView contentContainerStyle={styles.scrollView}>

          {/* Mosque Information */}
          <View style={styles.card}>
            <Text style={styles.title}>Personel Details</Text>

            {/* Mosque Basic Details */}
            <Text style={styles.label}>Full Name: <Text style={styles.normalText}>{ 'N/A'}</Text></Text>
            <Text style={styles.label}>Gender: <Text style={styles.normalText}>{ 'N/A'}</Text></Text>
            <Text style={styles.label}>Date of Birth: <Text style={styles.normalText}>{'N/A'}</Text></Text>
            <Text style={styles.label}>Marital Status: <Text style={styles.normalText}>{'N/A'}</Text></Text>
            <Text style={styles.label}>Member since: <Text style={styles.normalText}>{'N/A'}</Text></Text>
            <Text style={styles.label}>Height: <Text style={styles.normalText}>{ 'N/A'}</Text></Text>
            <Text style={styles.label}>Rank: <Text style={styles.normalText}>{ 'N/A'}</Text></Text>

            {/* Mosque Facilities */}
            <View style={styles.facilitiesSection}>
              <Text style={styles.subTitle}>Contact Information</Text>
              <Text style={styles.label}>Phone: <Text style={styles.normalText}>{ 'N/A'}</Text></Text>
              <Text style={styles.label}>State: <Text style={styles.normalText}>{'N/A'}</Text></Text>
              <Text style={styles.label}>LGA: <Text style={styles.normalText}>{ 'N/A'}</Text></Text>
              <Text style={styles.label}>Address: <Text style={styles.normalText}>{ 'N/A'}</Text></Text>
            </View>

            {/* <View style={styles.facilitiesSection}>
              <Text style={styles.subTitle}>Educational Background</Text>
              <Text style={styles.label}>Highest Educatiom: <Text style={styles.normalText}>{ 'N/A'}</Text></Text>
              <Text style={styles.label}>Field: <Text style={styles.normalText}>{'N/A'}</Text></Text>
              <Text style={styles.label}>Language Spoken: <Text style={styles.normalText}>{'N/A'}</Text></Text>
            </View> */}
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
    backgroundColor: '#F9F9F9', // bg-gray-100 equivalent
  },
  flexOne: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 24, // px-6 equivalent
    paddingVertical: 20, // py-5 equivalent
  },
  card: {
    backgroundColor: '#FFFFFF', // bg-white equivalent
    borderRadius: 12, // rounded-lg equivalent
    padding: 20, // p-5 equivalent
    marginBottom: 24, // mb-6 equivalent
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  title: {
    fontSize: 24, // text-2xl equivalent
    fontWeight: 'bold', // font-bold equivalent
    marginBottom: 16, // mb-4 equivalent
    color: '#003c1e', // text-primary equivalent
  },
  subTitle: {
    fontSize: 18, // text-lg equivalent
    fontWeight: 'bold',
    marginBottom: 8, // mb-2 equivalent
    color: '#003c1e', // text-primary equivalent
  },
  label: {
    fontSize: 16, // text-base equivalent
    fontWeight: '600', // font-semibold equivalent
    marginBottom: 4,
  },
  normalText: {
    fontWeight: '400', // font-normal equivalent
  },
  facilityText: {
    fontSize: 16, // text-base equivalent
    marginBottom: 4,
  },
  facilitiesSection: {
    marginTop: 16, // mt-4 equivalent
  },
  personnelItem: {
    marginBottom: 16, // mb-4 equivalent
  },
  picturesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8, // py-2 equivalent
  },
  picture: {
    width: '30%',
    height: 128, // h-32 equivalent
    marginBottom: 16, // mb-4 equivalent
    borderRadius: 12,
    marginHorizontal: 6,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 10
  },
});

export default Preview;
