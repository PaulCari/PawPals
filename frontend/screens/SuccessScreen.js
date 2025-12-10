// frontend/screens/SuccessScreen.js

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import AuthContainer from '../components/AuthContainer';
import { styles } from '../styles/successScreenStyles';

const SuccessScreen = ({ navigation, route }) => {
  //  RECIBIR clienteId desde RegisterScreen
  const clienteId = route.params?.clienteId;

  const handleNext = () => {
    if (clienteId) {
      //  PASAR clienteId a HomeScreen
      navigation.replace('Main', { clienteId });
    } else {
      console.error('❌ No se recibió clienteId en SuccessScreen');
      navigation.replace('Login');
    }
  };

  return (
    <AuthContainer>
      <View style={styles.card}>
        {/* Ícono de Éxito */}
        <View style={styles.iconContainer}>
          <Feather name="check" size={50} color="#732C71" />
        </View>

        <Text style={styles.title}>REGISTRO TERMINADO</Text>
        <Text style={styles.subtitle}>
          El proceso se ha realizado correctamente
        </Text>

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </AuthContainer>
  );
};

export default SuccessScreen;
