import Icon from '@expo/vector-icons/Feather';
import * as React from 'react';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { z } from 'zod';
import Button from '../../../../components/Button';
import { ExtensibleInput, CustomModal, ModalComponent } from '../../../../components';

// Define the zod schema for personel validation
const personelSchema = z.object({
  fullName: z.string().min(1, { message: 'fullName is required' }),
  role: z.string().min(1, { message: 'Role is required' }),
  phone: z.string().regex(/^[0-9]{10}$/, { message: 'Invalid phone number' })
});

// Define the zod schema for the entire personel list
const personelListSchema = z.array(personelSchema).refine(
  (data) => data.some(person => person.role === 'Imam'),
  {
    message: "There must be at least one Imam in the personnel list",
  }
);

const Personel = ({ navigation, route }: any) => {
  const [values, setValues] = useState({
    fullName: '',
    role: '',
    phone: ''
  });
  const [personelData, setPersonelData] = useState<any[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setValues({ ...values, [field]: value });
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const addPersonel = () => {
    try {
      const validatedData = personelSchema.parse(values);
      setPersonelData(prev => [...prev, validatedData]);
      setModalVisible(false);
      setValues({ fullName: '', role: '', phone: '' });
      setErrors({});
      setGeneralError(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const removePersonel = (fullName: string) => {
    setPersonelData(personelData.filter((data) => data.fullName !== fullName));
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setErrors({});
  };

  const openRoleModal = () => {
    setRoleModalVisible(true);
  };

  const closeRoleModal = () => {
    setRoleModalVisible(false);
  };

  const handleRoleSelection = (selectedRole: string) => {
    handleChange('role', selectedRole);
    closeRoleModal();
  };

  // Validate and handle form submission
  const handleSubmit = () => {
    try {
      const result = personelListSchema.parse(personelData);
      setGeneralError(null);
      console.log({ result })
      navigation.navigate('GeoTagging');

    } catch (error) {
      if (error instanceof z.ZodError) {
        setGeneralError(error.errors[0].message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flexOne}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View>
            <Text style={styles.title}>Contact Persons</Text>
            <Text style={{ marginBottom: 10 }}>Enter contact person's details</Text>
            <Button
              className='mt-5 bg-primary'
              variant='contained'
              title="Add Personnel"
              onPress={toggleModal}
            />

            <ModalComponent
              visible={isModalVisible}
              onClose={toggleModal}
              title="Add Personnel Data"
            >
              <View>
                <ExtensibleInput
                  label='Full Name'
                  placeholder='Enter Full Name'
                  value={values.fullName}
                  onChangeText={(text) => handleChange('fullName', text)}
                  error={errors.fullName}
                />
                <View style={styles.roleContainer}>
                  <Text style={styles.roleLabel}>Role</Text>
                  <TouchableOpacity style={styles.roleButton} onPress={openRoleModal}>
                    <Text>{values.role || 'Select Role'}</Text>
                  </TouchableOpacity>
                  {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
                </View>
                <ExtensibleInput
                  label='Mobile Number'
                  placeholder='Enter Mobile Number'
                  value={values.phone}
                  keyboardType='phone-pad'
                  onChangeText={(text) => handleChange('phone', text)}
                  error={errors.phone}
                />
                <View style={{ marginBottom: 10 }}>
                  <Button
                    variant='contained'
                    title='Add Personnel'
                    onPress={addPersonel}
                  />
                </View>
              </View>
            </ModalComponent>

            <View style={styles.divider} />

            <View style={styles.personnelHeader}>
              <View style={styles.nameColumn}>
                <Text>Fullname</Text>
              </View>
              <View style={styles.roleColumn}>
                <Text>Role</Text>
              </View>
              <View>
                <Icon name="info" size={20} color="#1E1E1E" />
              </View>
            </View>

            {personelData.map((data) => (
              <View key={data.fullName} style={styles.personnelRow}>
                <View style={styles.nameColumn}>
                  <Text>{data.fullName}</Text>
                </View>
                <View style={styles.roleColumn}>
                  <Text>{data.role}</Text>
                </View>
                <Pressable onPress={() => removePersonel(data.fullName)}>
                  <Icon name="trash-2" size={20} color="#FF4C4C" />
                </Pressable>
              </View>
            ))}

            {generalError && <Text style={styles.errorText}>{generalError}</Text>}
          </View>

          <View style={styles.actionButtons}>
            <Button
              title="Next"
              onPress={handleSubmit}
            />
            <Button
              title="Previous"
              variant='outline'
              onPress={() => navigation.goBack()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomModal
        visible={roleModalVisible}
        data={['Imam', 'Muadhin', 'Chairperson', 'Treasurer', 'Secretary']}
        onSelect={handleRoleSelection}
        onClose={closeRoleModal}
        title="Role"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // bg-white equivalent
  },
  flexOne: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 24, // px-6 equivalent
    paddingVertical: 20, // py-5 equivalent
  },
  title: {
    fontSize: 24, // text-2xl equivalent
    marginBottom: 16, // mb-4 equivalent
  },
  mb4: {
    marginBottom: 16, // mb-4 equivalent
  },
  grayText: {
    color: '#808080', // text-gray-600 equivalent
    marginBottom: 8, // mb-2 equivalent
  },
  roleSelect: {
    padding: 16, // p-4 equivalent
    borderWidth: 1,
    borderColor: '#D3D3D3', // border-gray-300 equivalent
    borderRadius: 8, // rounded-md equivalent
    fontSize: 16, // text-base equivalent
  },
  errorText: {
    color: '#FF4C4C', // text-red-500 equivalent
    marginTop: 8, // mt-1 equivalent
  },
  divider: {
    marginVertical: 12, // my-3 equivalent
    height: 1,
    backgroundColor: '#10b98133', // bg-primary/20 equivalent
  },
  personnelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12, // p-3 equivalent
    paddingVertical: 16, // py-4 equivalent
    backgroundColor: '#F1F5F9', // bg-slate-100 equivalent
    borderRadius: 8, // rounded equivalent
  },
  nameColumn: {
    width: '60%', // w-3/5 equivalent
  },
  roleColumn: {
    width: '30%', // w-2/6 equivalent
  },
  personnelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16, // py-4 equivalent
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 20,
    marginTop: 10,
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleLabel: {
    color: '#808080', // Light Gray
    marginBottom: 8,
  },
  roleButton: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#D3D3D3', // Light Gray
  },
});

export default Personel;