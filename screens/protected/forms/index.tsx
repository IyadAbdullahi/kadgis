import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import KadStack from './residential';
import SchoolStack from './school';
import OfficeStack from './office';
import LandStack from './land';
import PersonelStack from './personel';
import EquipmentStack from './equipment';

const Stack = createNativeStackNavigator();

export default function ProtectedStackNav() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Residential' component={KadStack} />
            <Stack.Screen name='School' component={SchoolStack} />
            <Stack.Screen name='Office' component={OfficeStack} />
            <Stack.Screen name='Land' component={LandStack} />
            <Stack.Screen name='Personel' component={PersonelStack} />
            <Stack.Screen name='Equipment' component={EquipmentStack} />
        </Stack.Navigator>
    );
}