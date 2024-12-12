import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Basic from './basic';
import GeoTagging from './geo-tagging';
import Location from './location';
// import Maintainance from './maintainance';
import Personel from './personel';

import Preview from './preview';

const Stack = createNativeStackNavigator();

const routes = [
    { name: 'Basic', component: Basic },
    { name: 'Location', component: Location },
    { name: 'Personel', component: Personel },
    // { name: 'Maintenance', component: Maintainance },
    { name: 'GeoTagging', component: GeoTagging },
    { name: 'Preview', component: Preview },
];

export default function FormsStack() {
    return (
        <Stack.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                headerBackVisible: false,
                headerTitle: () => (
                    <StepperUI currentScreen={route.name} />
                ),
            })}
        >
            {routes.map((screen, index) => (
                <Stack.Screen key={index} name={screen.name} component={screen.component} />
            ))}
        </Stack.Navigator>
    );
}

function StepperUI({ currentScreen }: any) {
    const totalSteps = routes.length;
    const currentIndex = routes.findIndex((route) => route.name === currentScreen) + 1;

    return (
        <View style={styles.stepperContainer}>
            {routes.map((route, index) => {
                const isActive = index < currentIndex;
                return (
                    <React.Fragment key={index}>
                        <View
                            style={[
                                styles.stepCircle,
                                { backgroundColor: isActive ? '#003c1e' : '#CBD5E1' }, // Using primary color and slate-300 equivalent
                            ]}
                        />
                        {index < totalSteps - 1 && (
                            <View
                                style={[
                                    styles.stepLine,
                                    { backgroundColor: isActive ? '#003c1e' : '#E5E7EB' }, // Using primary color and slate-200 equivalent
                                ]}
                            />
                        )}
                    </React.Fragment>
                );
            })}
            <Text style={styles.stepText}>{`Step ${currentIndex} of ${totalSteps}`}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    stepCircle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    stepLine: {
        height: 4,
        width: 16,
        marginHorizontal: 4,
    },
    stepText: {
        marginLeft: 16,
        fontSize: 12,
        color: '#4B5563', // Gray-600 equivalent
    },
});
