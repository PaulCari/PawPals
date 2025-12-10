// frontend/screens/SplashScreen.js (CON IMÁGENES)
import React, { useEffect, useRef } from 'react';
import { View, Image, Animated } from 'react-native';
import { styles } from '../styles/splashScreenStyles';

const logo = require('../assets/logo_amarillo.png');
const bone = require('../assets/bone.png'); // 🔥 Imagen de huesito
const paw = require('../assets/paw.png');   // 🔥 Imagen de patita

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const screenFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();

    const exitTimer = setTimeout(() => {
      Animated.timing(screenFadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('Welcome');
      });
    }, 2500);

    return () => clearTimeout(exitTimer);
  }, [navigation]);

  return (
    <Animated.View style={[styles.background, { opacity: screenFadeAnim }]}>
      <View style={styles.container}>
        {/* Logo animado */}
        <Animated.Image
          source={logo}
          style={[
            styles.logo,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />

        {/* Círculos decorativos */}
        <View style={styles.circleTopLeft} />
        <View style={styles.circleTopRight} />
        <View style={styles.circleBottomLeft} />
        <View style={styles.circleBottomRight} />
        
        {/* 🔥 HUESITOS CON IMÁGENES */}
        <Image source={bone} style={styles.boneImage1} />
        <Image source={bone} style={styles.boneImage2} />
        
        {/* 🔥 PATITAS CON IMÁGENES */}
        <Image source={paw} style={styles.pawImage1} />
        <Image source={paw} style={styles.pawImage2} />
        <Image source={paw} style={styles.pawImage3} />
      </View>
    </Animated.View>
  );
};

export default SplashScreen;