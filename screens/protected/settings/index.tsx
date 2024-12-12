import React, { useState } from 'react';
import Icon from '@expo/vector-icons/FontAwesome5';
import { SafeAreaView, ScrollView, Text, TextInput, View, Switch, Image, StyleSheet, Pressable } from 'react-native';
import { Button } from '../../../components';
import { useAuthStore } from '../../../store/auth';

const Settings: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [privacyEnabled, setPrivacyEnabled] = useState(false);
    const { logout, user } = useAuthStore();

    const handleChangePassword = () => {
        console.log('Password changed to:', newPassword);
        setNewPassword('');
        setCurrentPassword('');
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={()=> navigation.goBack()}>
                        <Icon name="arrow-left" size={20} color="#64748b" />
                    </Pressable>
                    <Text style={styles.headerText}>Settings</Text>
                </View>

                {/* User Info */}
                <View style={styles.card}>
                    {/* <Text style={styles.cardTitle}>User Info</Text> */}
                    <View style={styles.userInfoContainer}>
                        <Image source={{ uri: user?.picture || 'https://via.placeholder.com/100' }} style={styles.userImage} />
                        <View style={styles.userDetails}>
                            <View style={styles.userInfoRow}>
                                <Text style={styles.userInfoLabel}>Name:</Text>
                                <Text style={styles.userInfoValue}>{user?.fullName}</Text>
                            </View>
                            <View style={styles.userInfoRow}>
                                <Text style={styles.userInfoLabel}>Email:</Text>
                                <Text style={styles.userInfoValue}>{user?.email}</Text>
                            </View>
                            <View style={styles.userInfoRow}>
                                <Text style={styles.userInfoLabel}>Phone:</Text>
                                <Text style={styles.userInfoValue}>{user?.phone}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Change Password */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Change Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Current password"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="New password"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <Button title="Update Password" onPress={handleChangePassword} />
                </View>

                {/* Privacy */}
                <View style={styles.toggleContainer}>
                    <Text style={styles.cardTitle}>Email Notifications</Text>
                    <Switch value={privacyEnabled} onValueChange={setPrivacyEnabled} />
                </View>

                {/* Notifications */}
                <View style={styles.toggleContainer}>
                    <Text style={styles.cardTitle}>Push Notifications</Text>
                    <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
                </View>

                {/* Logout */}
                <View style={styles.card}>
                    <Button title="Logout" onPress={handleLogout} />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>App Version: 1.0.0</Text>
                    <Text style={styles.footerText}>© 2024 Your Company Name</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8', // bg-gray-100
    },
    scrollView: {
        flexGrow: 1,
        padding: 20, // padding: 20
    },
    header: {
        marginBottom: 24, // mb-6
        alignItems: 'center',
        flexDirection: 'row',
        gap: 30
    },
    headerText: {
        fontSize:20, // text-2xl
        fontWeight: 'bold',
        color: '#1f2937', // text-gray-900
    },
    card: {
        marginBottom: 24, // mb-6
        padding: 16, // p-4
        backgroundColor: '#ffffff', // bg-white
        borderRadius: 8, // rounded-lg
        elevation: 2, // shadow-sm
        flexDirection: 'column',
        gap: 10
    },
    cardTitle: {
        fontSize: 18, // text-lg
        fontWeight: '600', // font-semibold
        color: '#1f2937', // text-gray-800
    },
    userInfoContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: 12, // mt-3
    },
    userImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
        marginBottom: 16,
        backgroundColor: '#e5e7eb', // bg-gray-200 placeholder
    },
    userDetails: {
        flex: 1,
    },
    userInfoRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    userInfoLabel: {
        fontWeight: '600',
        color: '#4b5563', // text-gray-600
    },
    userInfoValue: {
        marginLeft: 8,
        color: '#1f2937', // text-gray-800
    },
    input: {
        marginTop: 12, // mt-3
        paddingHorizontal: 12, // px-3
        paddingVertical: 8, // py-2
        borderColor: '#d1d5db', // border-gray-300
        borderWidth: 1,
        borderRadius: 8, // rounded-lg
    },
    toggleContainer: {
        marginBottom: 24, // mb-6
        padding: 16, // p-4
        backgroundColor: '#ffffff', // bg-white
        borderRadius: 8, // rounded-lg
        elevation: 2, // shadow-sm
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footer: {
        marginTop: 48, // mt-12
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12, // text-xs
        color: '#9ca3af', // text-gray-400
    },
});

export default Settings;
