import React, { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Image, Alert, StyleSheet } from 'react-native';
import { Button, OTPInput } from '../../components';
import { COLORS } from '../../constants/color';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../../apis';
import { useActivityStore } from '../../store/activity';

const ConfirmRecover = ({ navigation, route }: any) => {
  const [otp, setOtp] = useState('');
  const { email } = route.params || {};
  const { showLoader, hideLoader, showSnack } = useActivityStore();

  const [timeLeft, setTimeLeft] = useState<number>(300); // Initial 5 minutes = 300 seconds
  const [canResend, setCanResend] = useState<boolean>(false);

  // Function to format the time remaining (mm:ss)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    // Start the countdown when the component is mounted
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);

      // Clear interval when the component unmounts or timeLeft reaches 0
      return () => clearInterval(timer);
    } else {
      setCanResend(true); // Enable the "Resend OTP" button after 5 minutes
    }
  }, [timeLeft]);

  const { mutate, isPending } = useMutation({
    mutationFn: apiService.validateOtp,
    onSuccess: (data) => {
      hideLoader();
      navigation.navigate('ResetPassword', { token: data.token });
    },
    onError: (error) => {
      showSnack(error.message, 'danger');
      hideLoader();
    },
  });
  const handleVerify = () => {
    if (otp.length === 6) {
      showLoader()
      mutate({ email, otp })

    } else {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code sent to your email.');
    }
  };

  const handleResendCode = () => {
    // TODO: Implement logic to resend OTP
    Alert.alert('Code Resent', 'A new verification code has been sent to your email.');
    setTimeLeft(300); // Reset to 5 minutes
    setCanResend(false); // Disable the button until countdown completes
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.container}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/kadgis_logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Header */}
            <Text style={styles.headerText}>Verify Your Email</Text>
            <View>
              <Text style={styles.subHeaderText}>
                Please enter the 6-digit code sent to {email}.
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* OTP Input */}
            <OTPInput
              value={otp}
              onChange={setOtp}
              autoFocus
            />

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                title="Verify"
                variant="contained"
                onPress={handleVerify}
              />
              <Button
                title={`${canResend ? 'Resend OTP' : `Resend After: ${formatTime(timeLeft)}`}`}
                variant="outline"
                onPress={handleResendCode}
                disabled={!canResend}
              />
              <Button
                title="Back to Forgot Password"
                variant="text"
                onPress={() => navigation.goBack()}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
    marginTop: 12,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: 24, // px-6
    paddingVertical: 32,   // py-8
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32, // mb-8
  },
  logo: {
    width: 140,
    height: 120,
  },
  headerText: {
    fontSize: 24, // text-2xl
    marginBottom: 16, // mb-4
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 16,
  },
  divider: {
    marginVertical: 12, // my-3
    height: 1,
    backgroundColor: COLORS.primaryTransparent, // bg-primary/20
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 20,
    marginTop: 20, // space-y is replaced with margin adjustments
  },
  verifyButton: {
    marginTop: 20, // mt-5
    backgroundColor: COLORS.primary,
  },
  resendButton: {
    marginTop: 20, // mt-5
  },
  backButton: {
    marginTop: 20, // mt-5
  },
});

export default ConfirmRecover;