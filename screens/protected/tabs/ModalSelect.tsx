import Icon from '@expo/vector-icons/FontAwesome5';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, Modal } from 'react-native';
import { useLanStore } from '../../../store/form';

const facilities = [

  {
    icon: 'home',
    text: 'Residential',
    route: 'Residential',
    color: '#10b981',
    background: '#a7f3d0',
  },
  {
    icon: 'building',
    text: 'Commercial',
    route: 'Residential',
    color: '#06b6d4',
    background: '#cffafe',
  },
  {
    icon: 'industry',
    text: 'Industrial',
    route: 'Residential',
    color: '#f59e0b',
    background: '#fef3c7',
  },
  {
    icon: 'warehouse',
    text: 'Agricultural',
    route: 'Land',
    color: '#f43f5e',
    background: '#ffe4e6',
  },
  {
    icon: 'users',
    text: 'Public Institution',
    route: 'Residential',
    color: '#f59e0b',
    background: '#ffedd5',
  },
]

function FormSelector({ visible, onClose }: any) {
  const [page, setPage] = useState('');
  const { updateLand } = useLanStore()
  const navigation = useNavigation();
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContainer}>
          {page === "Land" ? (
            <>
              <Text style={modalStyles.modalTitle}>Facility</Text>
              <Text style={modalStyles.modalMessage}>Choose Land Used</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, flexWrap: 'wrap', marginVertical: 5 }}>
                {facilities.map((item, index) => (
                  <Pressable
                    key={index}
                    onPress={() => { navigation.navigate('Forms', { screen: item.route }); onClose(); updateLand({ landUse: item.text }) }}
                    style={[modalStyles.box, { backgroundColor: item.background }]}>
                    <Icon name={item.icon} size={30} color={item.color} />
                    <Text style={{ fontWeight: '600' }}>{item.text}</Text>
                  </Pressable>
                ))}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginVertical: 10 }}>
                <Pressable onPress={() => setPage('')} style={modalStyles.backCircleButton}>
                  <FontAwesome name="arrow-left" size={20} color="#fff" />
                </Pressable>
                <Pressable onPress={() => {
                  setPage('');
                  onClose()
                }} style={modalStyles.closeCircleButton}>
                  <FontAwesome name="close" size={20} color="#fff" />
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={modalStyles.modalTitle}>Select Type</Text>
              <Text style={modalStyles.modalMessage}>Choose the type of record to publish</Text>
              {/* Facility Option */}
              <Pressable style={[modalStyles.optionButton, modalStyles.facilityButton]} onPress={() => {
                // navigation.navigate('Forms', { screen: 'Facility' });
                setPage('Land')
              }}>
                <Icon name="map-marked" size={30} color="#059669" />
                <Text style={modalStyles.optionText}>Land</Text>
              </Pressable>

              {/* Personnel Option */}
              {/* <Pressable style={[modalStyles.optionButton, modalStyles.personnelButton]} onPress={() => { navigation.navigate('Forms', { screen: 'Personel' });onClose(); }}>
              <Icon name="users" size={30} color="red" />
              <Text style={modalStyles.optionText}>Personnel</Text>
            </Pressable>

            <Pressable style={[modalStyles.optionButton, modalStyles.equipmentButton]} onPress={() => {  navigation.navigate('Forms', { screen: 'Equipment' });onClose() }}>
              <Icon name="box" size={30} color="#425ef7" />
              <Text style={modalStyles.optionText}>Equipments</Text>
            </Pressable> */}
              {/* Cancel Button */}

              <Pressable style={modalStyles.cancelButton} onPress={() => {
                setPage('');
                onClose()
              }}>
                <Text style={modalStyles.cancelText}>Cancel</Text>
              </Pressable>
            </>
          )
          }
        </View>
      </View>
    </Modal>
  )
}

export default FormSelector;

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  facilityButton: {
    backgroundColor: '#e6f4ea', // Light green background
  },
  personnelButton: {
    backgroundColor: '#fdecea', // Light red background
  },
  equipmentButton: {
    backgroundColor: '#eaf2ff'
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  backCircleButton: {
    width: 50,
    height: 50,
    backgroundColor: '#14532d',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeCircleButton: {
    width: 50,
    height: 50,
    backgroundColor: '#f44336',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButton: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#f44336',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  box: {
    width: "46%",  // Adjust size as necessary for your design
    height: 100,
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  }
});