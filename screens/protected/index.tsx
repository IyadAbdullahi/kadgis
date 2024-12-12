import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import FormsStack from './forms/index';
import TabNavigation from './tabs';
import Settings from './settings';

const Stack = createNativeStackNavigator();

export default function ProtectedStackNav() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Tabs' component={TabNavigation} />
            <Stack.Screen name='Settings' component={Settings} />
            <Stack.Screen name='Forms' options={{ presentation: "modal" }} component={FormsStack} />
        </Stack.Navigator>
    );
}