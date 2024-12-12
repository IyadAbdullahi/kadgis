import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import KadgisController from '../../../store/sqliteDb';
import { KadgisEnumeration } from '../../../store/form';

interface MosqueProps {
  mosque: KadgisEnumeration;
}

const MosqueItem: React.FC<MosqueProps> = ({ mosque }) => (
  <View style={styles.mosqueItemContainer}>
    <View style={styles.mosqueItemHeader}>
      <Text style={styles.mosqueName}>{mosque.name}</Text>
      <View style={[styles.statusContainer, mosque.name ? styles.published : styles.unpublished]}>
        <View style={[styles.statusDot, mosque.name ? styles.publishedDot : styles.unpublishedDot]} />
        <Text style={styles.statusText}>{mosque.name ? 'Remote' : 'Local'}</Text>
      </View>
    </View>
    <Text style={styles.dateText}>{new Date().toISOString()}</Text>
  </View>
);

const Uploads: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [mosquesArr, setMosquesArr] = useState<Mosque[]>([]);
  const [recordStats, setRecordStats] = useState(0);
  const db = useSQLiteContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mosqueController = await KadgisController.getInstance(db);
        const total = await mosqueController.countProperty();
        setRecordStats(total);
        const allMosques = await mosqueController.getAllRecords();
        setMosquesArr(allMosques);
      } catch (error) {
        console.error('Error fetching mosques:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Recent Uploads</Text>
        </View>

        <FlatList
          data={mosquesArr}
          keyExtractor={(item) => item.id.toString()} // Ensure a unique key for each mosque
          renderItem={({ item }) => <MosqueItem mosque={item} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // bg-gray-100
  },
  header: {
    marginBottom: 24, // mb-6
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24, // text-2xl
    fontWeight: 'bold',
    color: '#1f2937', // text-gray-900
  },
  mosqueItemContainer: {
    width: '100%',
    padding: 12, // p-3
    borderColor: '#cbd5e1', // border-slate-300
    borderWidth: 1,
    backgroundColor: '#ffffff', // bg-white
    borderRadius: 8, // rounded-lg
    elevation: 2, // shadow-md
    marginBottom: 8, // mb-2
  },
  mosqueItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4, // mb-1
  },
  mosqueName: {
    fontWeight: 'bold',
    fontSize: 16, // text-md
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 20, // rounded-full
  },
  published: {
    backgroundColor: '#d1fae5', // bg-green-100
  },
  unpublished: {
    backgroundColor: '#fee2e2', // bg-red-100
  },
  statusDot: {
    width: 8, // w-2
    height: 8, // h-2
    borderRadius: 50, // rounded-full
  },
  publishedDot: {
    backgroundColor: '#4ade80', // bg-green-400
  },
  unpublishedDot: {
    backgroundColor: '#f87171', // bg-red-400
  },
  statusText: {
    fontSize: 12, // text-xs
    marginLeft: 4, // ml-1
    color: '#4b5563', // gray-600
  },
  dateText: {
    fontSize: 10, // text-xs
    color: '#6b7280', // gray-500
  },
});

export default Uploads;
