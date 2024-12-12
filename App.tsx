import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import AuthStackNav from './screens/auth/index';
import ProtectedStackNav from './screens/protected';
import { useAuthStore } from './store/auth';
import KadgisController from './store/sqliteDb'; // Import the MosqueController
import ActivityWrapper from './screens/activity';
const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <SQLiteProvider databaseName="kadgis_enumeration.db">
      <QueryClientProvider client={queryClient}>
        <ActivityWrapper>
          <AppContent />
        </ActivityWrapper>
      </QueryClientProvider>
    </SQLiteProvider>
  );
}

// Separate component to handle initialization and rendering content
function AppContent() {
  const db = useSQLiteContext();
  const { user } = useAuthStore();
  const [isDbReady, setIsDbReady] = useState(false);
  const [version, setVersion] = useState('');

  useEffect(() => {
    async function setupDatabase() {
      try {
        const kadgisController = await KadgisController.getInstance(db); // Singleton instance
        const total = await kadgisController.getAllRecords();

        // Display SQLite version
        const result = await db.getFirstAsync<{ 'sqlite_version()': string }>(
          'SELECT sqlite_version()'
        );
        setVersion(result['sqlite_version()']);
        console.log('DB created');

        setIsDbReady(true); // Mark the database as ready once setup is complete
      } catch (error) {
        console.error('Database initialization error:', error);
      }
    }
    setupDatabase();
  }, [db]);

  if (!isDbReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading database...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Protected" component={ProtectedStackNav} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStackNav} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 16,
    color: '#333',
  },
});
