import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { apiService } from '../../apis';
import { Button, ExtensibleInput } from '../../components';
import { COLORS } from '../../constants/color';
import { useActivityStore } from '../../store/activity';
import { useAuthStore } from '../../store/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});



const Login: React.FC = ({ navigation }: any) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { showLoader, hideLoader, showSnack } = useActivityStore();
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const { login } = useAuthStore();

  const handleChange = (field: string, value: string) => {
    resetError(field);
    setFormData({ ...formData, [field]: value });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: apiService.login,
    onSuccess: (data) => {
      const { user, token, refreshToken } = data.data;
      hideLoader();
      login(user, token, refreshToken);
    },
    onError: (error) => {
      console.log(error);

      showSnack(error.message, 'danger');
      hideLoader();
    },
  });

  const resetError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleLogin = () => {
    const result = loginSchema.safeParse(formData);


    if (!result.success) {
      const newErrors: Record<string, string | undefined> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      showSnack('Please correct the errors before proceeding.', 'danger');
      setErrors(newErrors);
    } else {
      showLoader();
      setErrors({});
      console.log(result.data);
      mutate(result.data);
      // login({
      //   email: 'khalifamaigoro@gmail.com',
      //   fullName: 'Muhammad maigoro',
      //   id: 'qwec23c91',
      //   state: 'kaduna',
      //   lga: 'kaduna north',
      //   phone: '08129619375',
      //   picture: ''
      // }, 'hd8', "lkhgfdsa")
      // hideLoader()

    }
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
            <Text style={styles.headerText}>Welcome Back</Text>
            <Text style={styles.subHeaderText}>Enter your credentials to continue</Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Email Input */}
            <ExtensibleInput
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              error={errors.email}
            />

            {/* Password Input */}
            <ExtensibleInput
              label="Password"
              secureTextEntry
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              error={errors.password}
            />

            {/* Forgot Password */}
            <Text
              onPress={() => navigation.navigate('RecoverAccount')}
              style={styles.forgotPasswordText}
            >
              Forgot Password?
            </Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                title="Login"
                variant="contained"
                onPress={handleLogin}
              />
              <Button
                title="Create an Account"
                variant="outline"
                onPress={() => navigation.navigate('Register')}
                disabled={true}
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
    paddingHorizontal: 24,
    paddingVertical: 32,
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 140,
    height: 120,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 16,
  },
  divider: {
    marginVertical: 12,
    height: 1,
    backgroundColor: COLORS.primaryTransparent,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    textAlign: 'right',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 20,
    marginTop: 10,
  },
});

export default Login;
