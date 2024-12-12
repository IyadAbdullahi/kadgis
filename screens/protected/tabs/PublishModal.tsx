import React, { useEffect, useState, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from '@expo/vector-icons/Ionicons';

const PublishModal = ({ visible, onClose, totalRecords, onPublish }: any) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<String | null>(null);
    const progressAnim = useRef(new Animated.Value(0)).current;

    // Radius for the circular progress bar
    const radius = 50;
    const circumference = 2 * Math.PI * radius;

    // Animate circular progress
    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    // Start publishing when modal is visible
    useEffect(() => {
        if (visible) {
            setProgress(0);
            setError(null);
            startPublishing();
        }
    }, [visible]);

    // Mock function to simulate publishing and progress updates
    const startPublishing = async () => {
        for (let i = 1; i <= totalRecords; i++) {
            try {
                // Simulate an API call
                await new Promise((resolve) => setTimeout(resolve, 300));

                // Update progress
                setProgress((prev) => prev + (100 / totalRecords));
            } catch (err) {
                setError('An error occurred during publishing');
                break;
            }
        }
    };

    // Calculate stroke dashoffset for circular progress
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <Modal transparent={true} visible={visible} animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Icon name="close" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Publishing Records</Text>

                    {/* Circular Progress Indicator */}
                    <View style={styles.progressContainer}>
                        <Svg height={120} width={120}>
                            <Circle
                                stroke="#e6e6e6"
                                cx="60"
                                cy="60"
                                r={radius}
                                strokeWidth="10"
                                fill="none"
                            />
                            <Circle
                                stroke="#3b82f6"
                                cx="60"
                                cy="60"
                                r={radius}
                                strokeWidth="10"
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                            />
                        </Svg>
                        <View style={styles.progressTextContainer}>
                            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                            <Text style={styles.progressCounter}>
                                {Math.round((progress / 100) * totalRecords)} / {totalRecords}
                            </Text>
                        </View>
                    </View>

                    {/* Error Message */}
                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <TouchableOpacity onPress={onPublish} style={styles.publishButton}>
                        <Text style={styles.publishButtonText}>Start Publish</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    progressContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    progressTextContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3b82f6',
    },
    progressCounter: {
        fontSize: 14,
        color: '#666',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    publishButton: {
        marginTop: 20,
        backgroundColor: '#3b82f6',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    publishButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default PublishModal;
