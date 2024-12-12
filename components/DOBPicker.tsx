import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type DOBPickerProps = {
    onDateSelect: (date: string) => void; // Callback for selected date\
    onErrors: string | undefined;
};


const DOBPicker: React.FC<DOBPickerProps> = ({ onDateSelect, onErrors }) => {
    const [dob, setDob] = useState<string>(''); // State for selected date
    const [showPicker, setShowPicker] = useState<boolean>(false); // State for showing date picker

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowPicker(false); // Hide the date picker
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            setDob(formattedDate);
            onDateSelect(formattedDate); // Pass the date to the parent component
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Date of Birth</Text>
            <Pressable onPress={() => setShowPicker(true)} style={styles.input}>
                <Text style={dob ? styles.inputText : styles.placeholder}>
                    {dob || 'Select your Date of Birth'}
                </Text>
            </Pressable>
            {showPicker && (
                <DateTimePicker
                    value={dob ? new Date(dob) : new Date()} // Use selected date or current date
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()} // Prevent future dates
                />
            )}
            {onErrors && <Text style={styles.errorText}>{onErrors}</Text>}
        </View>
    );
};

export default DOBPicker;

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    label: {
        color: '#4B5563', // Gray-600
        marginBottom: 8,
    },
    input: {
        padding: 16,
        borderRadius: 8,
        fontSize: 16,
        borderColor: '#D1D5DB', // Gray-300
        borderWidth: 1,
    },
    inputText: {
        fontSize: 16,
        color: '#000',
    },
    placeholder: {
        fontSize: 16,
        color: 'black',
    },
    errorText: {
        color: '#FF4C4C', // Danger red color for error text
        marginTop: 4,
    },
});
