import Icon from '@expo/vector-icons/Feather';
import * as React from 'react';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { string, z } from 'zod';
import Button from '../../../../components/Button';
import { ExtensibleInput, CustomModal, ModalComponent } from '../../../../components';
import { useLanStore } from '../../../../store/form';

// Define the zod schema for personel validation
const propertySchema = z.object({
  plotNumber: z.string().min(1, { message: 'Plot Number is required' }),
  landSize: z.string().min(1, { message: 'Land Size is required' }),
  landPurpose: z.string().min(1, { message: 'Land Purpose is required' }),
  propertyType: z.string().min(1, { message: 'Property Type is required' }),
  propertyOccupancy: z.string().min(1, { message: ' Property Occupancy is required' }),
  accessAllowed: z.string().min(1, { message: 'Access status is required' }),
  numberOfBuildings: z
    .number()
    .min(1, { message: 'The number of buildings must not be less than 1' })
    .max(20, { message: 'Maximum number of buildings must not be greater than 20' }),
  numberOfOccupants: z
    .number()
    .min(1, { message: 'The number of occupants must not be less than 1' })
    .max(50, { message: 'Maximum number of occupants must not be greater than 50' }),
});

// Define the zod schema for the entire personel list
// const personelListSchema = z.array(personelSchema).refine(
//   (data) => data.some(person => person.role === 'Imam'),
//   {
//     message: "There must be at least one Imam in the personnel list",
//   }
// );

const Property = ({ navigation, route }: any) => {
  const [values, setValues] = useState({
    plotNumber: '',
    landSize: '',
    landPurpose: '',
    propertyType: '',
    propertyOccupancy: '',
    accessAllowed: '',
    numberOfBuildings: 0,
    numberOfOccupants: 0,

  });
  // const [personelData, setPersonelData] = useState<any[]>([]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [accessModalVisible, setAccessModalVisible] = useState(false);
  const [occupancyModalVisible, setOccupancyModalVisible] = useState(false);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  // const [generalError, setGeneralError] = useState<string | null>(null);
  const { land, updateLand } = useLanStore();


  const handleChange = (field: string, value: string) => {
    const numericFields = ['numberOfBuildings', 'numberOfOccupants'];

    // Convert to number if it's a numeric field, otherwise keep as string
    const newValue = numericFields.includes(field) && value != '' ? parseInt(value, 10) : value;
    setValues({ ...values, [field]: newValue });
    setErrors(prev => ({ ...prev, [field]: '' }));
    console.log({ ...values });

  };

  // const addPersonel = () => {
  //   try {
  //     const validatedData = personelSchema.parse(values);
  //     setPersonelData(prev => [...prev, validatedData]);
  //     setModalVisible(false);
  //     setValues({ fullName: '', role: '', phone: '' });
  //     setErrors({});
  //     setGeneralError(null);
  //   } catch (error) {
  //     if (error instanceof z.ZodError) {
  //       const newErrors: Record<string, string> = {};
  //       error.errors.forEach((err) => {
  //         if (err.path) {
  //           newErrors[err.path[0]] = err.message;
  //         }
  //       });
  //       setErrors(newErrors);
  //     }
  //   }
  // };

  // const removePersonel = (fullName: string) => {
  //   setPersonelData(personelData.filter((data) => data.fullName !== fullName));
  // };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setErrors({});
  };

  // const openRoleModal = () => {
  //   setRoleModalVisible(true);
  // };

  // const closeRoleModal = () => {
  //   setRoleModalVisible(false);
  // };

  // const handleRoleSelection = (selectedRole: string) => {
  //   handleChange('role', selectedRole);
  //   closeRoleModal();
  // };

  // Reset error for the specific field
  const resetError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }
  // Validate and handle form submission
  const handleSubmit = () => {
    try {
      const result = propertySchema.parse(values);
      // setGeneralError(null);
      console.log({ result })
      updateLand(result);
      navigation.navigate('GeoTagging', { result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string | undefined> = {};
        error.issues.forEach((issue) => {
          newErrors[issue.path[0]] = issue.message;
          console.log('error');
        });
        setErrors(newErrors);

      }
    }
  };
  React.useEffect(() => {
    console.log({ land })
  }, [land])

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flexOne}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View>
            <Text style={styles.title}>Property Information</Text>
            <Text style={{ marginBottom: 10 }}>Enter Property details</Text>
            {/* <Button
              className='mt-5 bg-primary'
              variant='contained'
              title="Add Personnel"
              onPress={toggleModal}
            /> */}

            {/* <ModalComponent
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
            </ModalComponent> */}

            {/* <View style={styles.divider} />

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
            </View> */}

            {/* {personelData.map((data) => (
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
            ))} */}

            <ExtensibleInput
              label='Plot Number'
              placeholder='Enter Plot Number'
              value={values.plotNumber}
              keyboardType='numeric'
              onChangeText={(text) => handleChange('plotNumber', text)}
              error={errors.plotNumber} // Display error message if present
              onFocus={() => resetError('plotNumber')} // Reset error on focus
            />
            <ExtensibleInput
              label='Land Size'
              placeholder='Enter Size (Sqr Meter)'
              value={values.landSize}
              keyboardType='numeric'
              onChangeText={(text) => handleChange('landSize', text)}
              error={errors.landSize} // Display error message if present
              onFocus={() => resetError('landSize')} // Reset error on focus
            />
            <ExtensibleInput
              label='Land Purpose'
              placeholder='Enter Land Purpose'
              value={values.landPurpose}
              onChangeText={(text) => handleChange('landPurpose', text)}
              error={errors.landPurpose} // Display error message if present
              onFocus={() => resetError('landPurpose')} // Reset error on focus
            />
            {/* Property Type Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Property Type</Text>
              <TouchableOpacity
                style={[styles.selectInput, errors.propertyType ? styles.errorBorder : styles.defaultBorder]}
                onPress={() => { setTypeModalVisible(true); resetError('propertyType') }}
              >
                <Text>{values.propertyType || 'Property Type'}</Text>
              </TouchableOpacity>
              {errors.propertyType && <Text style={styles.errorText}>{errors.propertyType}</Text>}
            </View>

            <ExtensibleInput
              label='Number of Buildings'
              placeholder='Enter Number of Buildings'
              value={String(values.numberOfBuildings)}
              keyboardType='numeric'
              onChangeText={(text) => handleChange('numberOfBuildings', text)}
              error={errors.numberOfBuildings} // Display error message if present
              onFocus={() => resetError('numberOfBuildings')} // Reset error on focus
            />

            {/* Occupancy Status Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Property Occupancy</Text>
              <TouchableOpacity
                style={[styles.selectInput, errors.propertyOccupancy ? styles.errorBorder : styles.defaultBorder]}
                onPress={() => { setOccupancyModalVisible(true); resetError('propertyOccupancy') }}
              >
                <Text>{values.propertyOccupancy || 'Property Occupancy'}</Text>
              </TouchableOpacity>
              {errors.propertyOccupancy && <Text style={styles.errorText}>{errors.propertyOccupancy}</Text>}
            </View>

            <ExtensibleInput
              label='Number of Occupants'
              placeholder='Enter Number of Occupants'
              value={String(values.numberOfOccupants)} // ensure this is a string input for the ExtensibleInput
              keyboardType='numeric'
              onChangeText={(text) => handleChange('numberOfOccupants', text)}
              error={errors.numberOfOccupants}
              onFocus={() => resetError('numberOfOccupants')}
            />

            {/* Access Status Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Access Allowed</Text>
              <TouchableOpacity
                style={[styles.selectInput, errors.accessAllowed ? styles.errorBorder : styles.defaultBorder]}
                onPress={() => { setAccessModalVisible(true); resetError('accessAllowed') }}
              >
                <Text>{values.accessAllowed || 'Access Allowed'}</Text>
              </TouchableOpacity>
              {errors.accessAllowed && <Text style={styles.errorText}>{errors.accessAllowed}</Text>}
            </View>



            {/* {generalError && <Text style={styles.errorText}>{generalError}</Text>} */}
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

      {/* Access Modal */}
      <CustomModal
        visible={accessModalVisible}
        data={['Yes', 'No']}
        onSelect={(text) => handleChange('accessAllowed', text)}
        onClose={() => setAccessModalVisible(false)}
        title="Access Allowed"
      />
      {/* Occupancy Modal */}
      <CustomModal
        visible={occupancyModalVisible}
        data={['Owner occupier', 'Tenancy', 'Commercial', 'Vacant']}
        onSelect={(text) => handleChange('propertyOccupancy', text)}
        onClose={() => setOccupancyModalVisible(false)}
        title="Property Occupancy"
      />
      {/* Type Modal */}
      <CustomModal
        visible={typeModalVisible}
        data={['Duplex', 'Bungalow', 'Flat', 'Tenement Building', 'Storey', 'Multi Storey', 'Block of Flats']}
        onSelect={(text) => handleChange('propertyType', text)}
        onClose={() => setTypeModalVisible(false)}
        title="Property Type"
      />
      {/* 
      <CustomModal
        visible={roleModalVisible}
        data={['Imam', 'Muadhin', 'Chairperson', 'Treasurer', 'Secretary']}
        onSelect={handleRoleSelection}
        onClose={closeRoleModal}
        title="Role"
      /> */}
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
  fieldContainer: {
    marginBottom: 16,
  },
  selectInput: {
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  defaultBorder: {
    borderColor: '#D1D5DB', // Gray-300
    borderWidth: 1,
  },
  errorBorder: {
    borderColor: '#FF4C4C', // Danger red color for error
    borderWidth: 1,
  },
  label: {
    color: '#4B5563', // Gray-600
    marginBottom: 8,
  },
});

export default Property;