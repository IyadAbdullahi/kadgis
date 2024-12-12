import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Image, Alert, StyleSheet } from 'react-native';
import { Button, ExtensibleInput } from '../../components';
import { COLORS } from '../../constants/color';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../../apis';
import { useActivityStore } from '../../store/activity';

const ResetPassword = ({ navigation, route }: any) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showLoader, hideLoader, showSnack } = useActivityStore();


  // Assume the reset token is passed as a parameter
  const { token } = route.params || {};

  const validatePasswords = () => {
    if (!newPassword) {
      return 'New password is required';
    }
    if (newPassword.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (newPassword !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };
  const { mutate, isPending } = useMutation({
    mutationFn: apiService.resetPassword,
    onSuccess: (data) => {
      hideLoader();
      Alert.alert('Password Reset', 'Your password has been successfully reset.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
      // navigation.navigate('ResetPassword', { token: data.token });
    },
    onError: (error) => {
      showSnack(error.message, 'danger');
      hideLoader();
    },
  });

  const handleResetPassword = () => {
    const passwordError = validatePasswords();
    if (passwordError) {
      showSnack(passwordError, 'danger')
    } else {
      showLoader();
      mutate({ token, password: newPassword })

    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.innerContainer}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/jibwis_logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Header */}
            <Text style={styles.headerText}>Reset Password</Text>
            <View>
              <Text>Enter your new password</Text>
            </View>
            <View style={styles.separator} />

            {/* New Password Input */}
            <ExtensibleInput
              label="New Password"
              secureTextEntry
              placeholder="Enter your new password"
              value={newPassword}
              onChangeText={setNewPassword}
            />

            {/* Confirm Password Input */}
            <ExtensibleInput
              label="Confirm Password"
              secureTextEntry
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                variant="contained"
                title="Reset Password"
                onPress={handleResetPassword}
              />
              <Button
                variant="outline"
                title="Back to Login"
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Equivalent to bg-white
  },
  keyboardAvoidingView: {
    flex: 1,
    marginTop: 48, // Equivalent to mt-12
  },
  scrollView: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24, // Equivalent to px-6
    paddingVertical: 32, // Equivalent to py-8
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32, // Equivalent to mb-8
  },
  logo: {
    width: 140,
    height: 120,
  },
  headerText: {
    fontSize: 24, // Equivalent to text-2xl
    marginBottom: 16, // Equivalent to mb-4
  },
  separator: {
    marginVertical: 12, // Equivalent to my-3
    height: 1,
    backgroundColor: '#003c1e33', // Equivalent to bg-primary/20
  },
  buttonContainer: {
    marginTop: 20, // Equivalent to space-y-4
    flexDirection: 'column',
    gap: 20,
  },
  primaryButton: {
    marginTop: 20, // Equivalent to mt-5
    backgroundColor: '#003c1e', // Equivalent to bg-primary
  },
  outlineButton: {
    marginTop: 20, // Equivalent to mt-5
  },
});


export default ResetPassword;