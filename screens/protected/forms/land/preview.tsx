import * as React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { Button } from '../../../../components';

const Preview = ({ navigation }: any) => {

  async function handleSave() {
    try {
      navigation.navigate('Home');

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
            <Text style={styles.title}>Land Details</Text>
            <Text style={styles.label}>Name: <Text style={styles.normalText}>{ 'N/A'}</Text></Text>
            <Text style={styles.label}>Height: <Text style={styles.normalText}>{'N/A'}</Text></Text>
            <Text style={styles.label}>Length: <Text style={styles.normalText}>{ 'N/A'}</Text></Text>
          </View>

          {/* Mosque Personnel */}
          <View style={styles.card}>
            <Text style={styles.title}>Contact Persons</Text>

          </View>

          {/* Mosque Pictures (Rendered in a 3-Column Grid) */}
          <View style={styles.card}>
            <Text style={styles.title}>Pictures</Text>

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
