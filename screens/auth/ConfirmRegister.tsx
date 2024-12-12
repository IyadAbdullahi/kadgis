import React, { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Image, Alert, StyleSheet } from 'react-native';
import { Button, OTPInput } from '../../components';
import { COLORS } from '../../constants/color';
import { useActivityStore } from '../../store/activity';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../../apis';

const ConfirmRegister: React.FC = ({ navigation, route }: any) => {
  const [code, setCode] = useState('');
  const [isResending, setIsResending] = useState(false);
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

  // Extract formData from the previous screen
  const { formData } = route.params;

  // Confirm OTP Code
  const { mutate: confirmOtp } = useMutation({
    mutationFn: apiService.register,
    onSuccess: () => {
      hideLoader();
      // showSnack("Registration confirmed successfully!", 'success');
      Alert.alert('Account Creation', 'Registration confirmed successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    },
    onError: (error: any) => {
      hideLoader();
      showSnack(error.message, 'danger');
    },
  });

  // Resend OTP Code
  const { mutate: resendOtp } = useMutation({
    mutationFn: apiService.register,
    onSuccess: () => {
      showSnack("OTP code resent successfully!", 'info');
      setIsResending(false);
    },
    onError: (error: any) => {
      setIsResending(false);
      console.log({ error });
      showSnack(error.message || "Failed to resend OTP", 'danger');
    },
  });

  const handleConfirm = async () => {
    if (code.length !== 6) {
      showSnack("Please enter a 6-digit OTP code", 'danger');
      return;
    }
    showLoader();
    confirmOtp({ ...formData, otp: code });
  };

  const handleResendCode = async () => {
    setIsResending(true);
    resendOtp({ email: formData.email });
    setTimeLeft(300); // Reset to 5 minutes
    setCanResend(false); // Disable the button until countdown completes
  };

  useEffect(() => {
    setIsResending(false);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.container}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image source={require('../../assets/kadgis_logo.png')} style={styles.logo} resizeMode="contain" />
            </View>

            {/* Header */}
            <Text style={styles.headerText}>Confirm Your Email</Text>
            <Text style={styles.descriptionText}>
              Please enter the 6-digit code sent to your email address.
            </Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* OTP Input */}
            <OTPInput value={code} onChange={setCode} autoFocus />

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                title="Confirm"
                variant="contained"
                onPress={handleConfirm}
              // isLoading={confirmLoading}
              // disabled={isSubmitting || code.length !== 6}
              />
              <Button
                title={`${canResend ? 'Resend Code' : `Resend After: ${formatTime(timeLeft)}`}`}
                variant="outline"
                onPress={handleResendCode}
                // isLoading={resendLoading}
                disabled={!canResend}
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
    marginTop: 4, // mt-1
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
    width: 144, // w-36
    height: 112, // h-28
  },
  headerText: {
    fontSize: 24, // text-2xl
    marginBottom: 16, // mb-4
  },
  descriptionText: {
    fontSize: 16,
  },
  divider: {
    marginVertical: 12, // my-3
    height: 1,
    backgroundColor: COLORS.primaryTransparent, // bg-primary/20
  },
  otpInput: {
    marginTop: 16, // mt-4
  },
  buttonContainer: {
    marginTop: 20, // Equivalent to mt-6
    flexDirection: 'column',
    gap: 20,
  },
  confirmButton: {
    marginBottom: 16, // mb-4
  },
  resendButton: {
    marginTop: 8, // mt-2
  },
});

export default ConfirmRegister;
