import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useActivityStore } from '../store/activity';
import LottieView from 'lottie-react-native';

const ActivityWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading, snackMessage, snackVariant, hideSnack } = useActivityStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (snackMessage) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [snackMessage, fadeAnim]);

  return (
    <View style={styles.container}>
      {children}
      {isLoading && (
        <View style={styles.loaderContainer}>
          <View style={styles.lottieWrapper}>
            <LottieView
              source={require('../assets/animation.json')} // Ensure this path is correct
              autoPlay
              loop
              style={styles.lottie} // Added specific styling for the LottieView
            />
          </View>
        </View>
      )}
      {snackMessage && (
        <Animated.View
          style={[
            styles.snackBar,
            {
              backgroundColor:
                snackVariant === 'success' ? '#38A169' : snackVariant === 'danger' ? '#E53E3E' : '#4299E1',
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity onPress={hideSnack} style={styles.snackContent}>
            <Text style={styles.snackText}>{snackMessage}</Text>
            <Text style={styles.snackClose}>✕</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: 30
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  lottieWrapper: {
    width: 150,
    height: 150,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  snackBar: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    padding: 15,
    borderRadius: 8,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  snackContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  snackText: {
    color: '#fff',
    fontWeight: '600',
    flex: 1,
  },
  snackClose: {
    color: '#fff',
    marginLeft: 10,
  },
});

export default ActivityWrapper;