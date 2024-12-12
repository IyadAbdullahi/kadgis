import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/color';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

interface ExtensibleInputProps extends React.ComponentPropsWithoutRef<typeof TextInput> {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  onFocus?: () => void; // Make onFocus optional
}

const ExtensibleInput: React.FC<ExtensibleInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  onFocus, // Destructure here
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Input Field */}
      <View style={styles.inputField}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A1A1A1"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          onFocus={() => {
            setIsFocused(true)
            if (onFocus) {
              onFocus(); // Call onFocus if provided
            }
          }}
          onBlur={() => setIsFocused(false)}
          {...props}  // Forward remaining props to TextInput
        />
        {secureTextEntry &&
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name="eye" size={18} color="#333" />
          </TouchableOpacity>}
      </View>
      {error && <Text style={{ color: '#EF4444', marginTop: 4 }}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    color: '#4B5563', // Equivalent to gray-600
    marginBottom: 8,
  },
  inputField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    borderRadius: 8
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: '', // Equivalent to primary color
  },
});

export default ExtensibleInput;
