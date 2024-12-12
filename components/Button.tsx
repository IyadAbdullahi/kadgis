import React from 'react';
import { Pressable, Text, View, StyleSheet, PressableProps } from 'react-native';
import LottieView from 'lottie-react-native';
import animation from '../assets/animation.json';
import { COLORS } from '../constants/color';

interface ButtonProps extends PressableProps {
  title: string;
  onPress: () => void;
  variant?: 'contained' | 'outline' | 'text';
  className?: string; // Optional additional Tailwind classes
  isLoading?: boolean; // New prop to show loading indicator
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'contained',
  isLoading = false, // Default is not loading
  ...props
}) => {
  // Function to handle different button variants
  const getVariantStyle = () => {
    switch (variant) {
      case 'contained':
        return styles.containedButton;
      case 'outline':
        return styles.outlineButton;
      case 'text':
        return styles.textButton;
      default:
        return {};
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'contained':
        return styles.containedText;
      case 'outline':
        return styles.outlineText;
      case 'text':
        return styles.textButtonText;
      default:
        return {};
    }
  };

  return (
    <View>
      <Pressable
        onPress={onPress}
        disabled={isLoading} // Disable button when loading
        style={[styles.baseButton, getVariantStyle()]} // Combine base, variant styles
        {...props}
      >
        {isLoading ? (
          <LottieView
            source={animation}
            autoPlay
            loop
            speed={1}
            style={styles.lottieStyle}
          />
        ) : (
          <Text style={[styles.textBase, getTextColor()]}>
            {title}
          </Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containedButton: {
    backgroundColor: COLORS.primaryBackground,
  },
  outlineButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primaryBackground,
    borderWidth: 1,
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  textBase: {
    fontSize: 18,
    fontWeight: '300',
  },
  containedText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
  textButtonText: {
    color: COLORS.primary,
  },
  lottieStyle: {
    width: 50,
    height: 50, // Adjusted to fit button size
  },
});

export default Button;
