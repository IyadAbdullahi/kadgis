import React, { useRef, useEffect } from 'react';
import { View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, StyleSheet } from 'react-native';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  autoFocus = false,
  ...props
}) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, text: string) => {
    const newValue = value.split('');
    newValue[index] = text;
    onChange(newValue.join(''));

    // Auto-focus the next input field
    if (text !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (event.nativeEvent.key === 'Backspace' && index > 0 && value[index] === '') {
      // Auto-focus the previous input field on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={[styles.container, { marginBottom: 12 }]}>
      {[...Array(6)].map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={[styles.input, {...props}]}
          maxLength={1}
          value={value[index] || ''}
          onChangeText={(text) => handleChange(index, text)}
          onKeyPress={(event) => handleKeyPress(index, event)}
          keyboardType="number-pad"
          returnKeyType="done"
          selectionColor="transparent"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 8, // Rounded corners
    width: 40, // Adjust width if needed
    height: 48, // Adjust height if needed
    textAlign: 'center',
    fontSize: 24, // Larger text size for better readability
    marginHorizontal: 8, // Space between inputs
  },
});

export default OTPInput;
