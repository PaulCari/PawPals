import React from 'react';
// StyleSheet ya no se importa aquí
import { View, Text, TouchableOpacity } from 'react-native';
import AuthContainer from '../components/AuthContainer';
import { Feather } from '@expo/vector-icons';
// Paso 1: Importar los estilos desde su nueva ubicación
import { styles } from '../styles/successScreenStyles';

const SuccessScreen = ({ navigation }) => {
  return (
    <AuthContainer>
      <View style={styles.card}>
        {/* Ícono de Éxito */}
        <View style={styles.iconContainer}>
          <Feather name="check" size={50} color="#6A0DAD" />
        </View>

        <Text style={styles.title}>REGISTRO TERMINADO</Text>
        <Text style={styles.subtitle}>El proceso se ha realizado correctamente</Text>
        
        <TouchableOpacity style={styles.buttonPrimary} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </AuthContainer>
  );
};
export default SuccessScreen;