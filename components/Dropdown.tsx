import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import Button from './Button';
import ExtensibleInput from './ExtensibleInput';

interface CustomModalProps {
    visible: boolean;
    data: string[];
    onSelect: (value: string) => void;
    onClose: () => void;
    title: string;
}

const CustomModal: React.FC<CustomModalProps> = ({ visible, data, onSelect, onClose, title }) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter the data based on search input
    const filteredData = data.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));

    // Render individual options
    const renderOption = (option: string) => (
        <TouchableOpacity
            style={styles.option}
            onPress={() => {
                onSelect(option); // Call onSelect with the selected value
                onClose(); // Close the modal
            }}
        >
            <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={onClose}>
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>{title}</Text>

                    {/* Search Input */}
                    <ExtensibleInput
                        placeholder={`Search ${title}`}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        label={''}
                    />

                    {/* List of Options */}
                    <FlatList
                        data={filteredData}
                        renderItem={({ item }) => renderOption(item)}
                        keyExtractor={(item, index) => index.toString()}
                    />

                    {/* Close Button */}
                    <Button title="Close" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 24,
    },
    innerContainer: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    option: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB', // Border color equivalent to slate-200
    },
    optionText: {
        fontSize: 18,
    },
});

export default CustomModal;
