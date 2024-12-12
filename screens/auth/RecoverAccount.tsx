import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Image, Alert, StyleSheet } from 'react-native';
import { Button, ExtensibleInput } from '../../components';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../../apis';
import { useActivityStore } from '../../store/activity';

const RecoverAccount = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const { showLoader, hideLoader, showSnack } = useActivityStore();


  const validateEmail = () => {
    if (!email) {
      return 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Invalid email format';
    }
    return '';
  };
  const { mutate, isPending } = useMutation({
    mutationFn: apiService.recoverAccount,
    onSuccess: (data) => {
      hideLoader();
      navigation.navigate('ConfirmRecover', { email });
    },
    onError: (error) => {
      showSnack(error.message, 'danger');
      hideLoader();
    },
  });

  const handleResetPassword = () => {
    const emailError = validateEmail();
    if (emailError) {
      showSnack(emailError, 'danger');
    } else {
      showLoader()
      mutate({ email })
      // TODO: Implement password reset logic here
      // Alert.alert('Password Reset', 'If an account exists for this email, a password reset link will be sent.');
      // Optionally, navigate back to login screen
      // navigation.navigate('ConfirmRecover', { email: email });
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
            <Text style={styles.headerText}>Recover Account</Text>
            <View>
              <Text>Enter your email to reset your password</Text>
            </View>
            <View style={styles.separator} />

            {/* Email Input */}
            <ExtensibleInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
            />

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                variant="contained"
                title={'Recover Account'}
                onPress={handleResetPassword}
              />
              <Button
                variant="outline"
                title={'Back to Login'}
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
    marginTop: 12, // Equivalent to mt-12
  },
  scrollView: {
    flexGrow: 1,
  },
  innerContainer: {
    paddingHorizontal: 24, // Equivalent to px-6
    paddingVertical: 32, // Equivalent to py-8
    flex: 1,
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
    height: 1, // Equivalent to h-[1px]
    backgroundColor: '#003c1e33', // Equivalent to bg-primary/20
    marginVertical: 12, // Equivalent to my-3
  },
  buttonContainer: {
    marginTop: 20, // Equivalent to mt-6
    flexDirection: 'column',
    gap: 20,
  },
  primaryButton: {
    backgroundColor: '#003c1e', // Equivalent to bg-primary
    marginBottom: 16, // Equivalent to mb-4
  },
  outlineButton: {
    marginTop: 16, // Equivalent to mt-5
  },
});

export default RecoverAccount;