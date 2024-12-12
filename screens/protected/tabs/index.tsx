import Icon from '@expo/vector-icons/FontAwesome5';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { View } from 'react-native';
import HomeScreen from './HomeScreen';
import Uploads from './UploadScreen'
import FormsStack from '../forms/index';
import FormSelector from './ModalSelect';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {

  const [isCustomModalVisible, setCustomModalVisible] = useState(false);

  const closeCustomModal = () => {
    setCustomModalVisible(false);
  };
  const openCustomModal = () => {
    setCustomModalVisible(true);
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            paddingHorizontal: '2%',
            borderWidth: 0,
          },
        }}>

        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name='home' size={25} color={color} />
            ),
            tabBarActiveTintColor: '#003c1e',
            tabBarInactiveTintColor: '#64748b',
          }}
        />

        <Tab.Screen
          name="Form"
          component={FormsStack}
          options={{
            tabBarStyle: { display: 'none' },
            tabBarIcon: ({ color, size }) => (
              <View style={{
                position: 'absolute',
                backgroundColor: '#f8b01b',
                width: 60,
                height: 60,
                borderRadius: 50,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Icon
                  name='plus'
                  size={33}
                  color={'#fff'}
                />
              </View>
            ),
            tabBarLabel: ''
          }}
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault();
              openCustomModal();
            }
          })}
        />

        <Tab.Screen
          name="Uploads"
          component={Uploads}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name='history' size={25} color={color} />
            ),
            tabBarActiveTintColor: '#003c1e',
            tabBarInactiveTintColor: '#64748b',
          }}
        />
      </Tab.Navigator>

      <FormSelector visible={isCustomModalVisible} onClose={closeCustomModal} />
    </>
  );
}