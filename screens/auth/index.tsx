import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Login';
import RegisterScreen from './Register';
import React from 'react';
import RecoverAccount from './RecoverAccount';
import ConfirmRegister from './ConfirmRegister';
import ConfirmRecover from './ConfirmRecover';
import ResetPassword from './ResetPassword';

const Stack = createNativeStackNavigator();

export default function AuthStackNav() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Register' component={RegisterScreen} />
            <Stack.Screen name='ConfirmRegister' component={ConfirmRegister} />
            <Stack.Screen name="RecoverAccount" component={RecoverAccount} />
            <Stack.Screen name="ConfirmRecover" component={ConfirmRecover} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />


        </Stack.Navigator>
    );
}