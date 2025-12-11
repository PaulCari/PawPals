// frontend/screens/PaymentScreen.js (VERSIÓN SIMPLIFICADA)
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/paymentScreenStyles'; // Usamos los mismos estilos base

const PaymentScreen = ({ navigation, route }) => {
  const { clienteId, total, pedidoId } = route.params || {};

  const [selectedMethodId, setSelectedMethodId] = useState(null);

  const paymentMethods = [
    { id: '1', name: 'Yape', qr: require('../assets/qr/imagen1.png'), icon: 'phone-portrait-outline' },
    { id: '2', name: 'Plin', qr: require('../assets/qr/imagen2.png'), icon: 'wallet-outline' },
  ];
  
  const handleContinue = () => {
    if (!selectedMethodId) {
        Alert.alert("Selección requerida", "Por favor, elige un método de pago para continuar.");
        return;
    }
    
    const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethodId);

    // Navegamos a la nueva pantalla pasando todos los datos necesarios
    navigation.navigate('UploadProof', {
        clienteId,
        pedidoId,
        total,
        paymentMethod: selectedPaymentMethod, // Pasamos el objeto completo
    });
  };

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require('../assets/FONDOA.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          <Image source={require('../assets/logo_amarillo.png')} style={styles.logo} />
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.container}>
          <ScrollView
           style={styles.container} // Quitamos flex: 1
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.paymentTitle}>Realizar Pago</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resumen del Pago</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total a pagar:</Text>
                  <Text style={styles.totalValue}>S/ {total?.toFixed(2) || '0.00'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Selecciona el método de pago</Text>
              <View style={styles.methodsContainer}>
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    style={[styles.methodCard, selectedMethodId === method.id && styles.methodCardSelected]}
                    onPress={() => setSelectedMethodId(method.id)}
                  >
                    <View style={styles.radioButton}>
                      {selectedMethodId === method.id && <View style={styles.radioButtonInner} />}
                    </View>
                    <Ionicons name={method.icon} size={24} color={selectedMethodId === method.id ? '#875686' : '#666'} />
                    <Text style={[styles.methodName, selectedMethodId === method.id && styles.methodNameSelected]}>
                      {method.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {selectedMethodId && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>2. Escanea y Paga</Text>
                <View style={styles.qrCard}>
                  <Image source={paymentMethods.find(m => m.id === selectedMethodId)?.qr} style={styles.qrImage} />
                  <Text style={styles.qrInstructions}>
                    1. Abre tu app de {paymentMethods.find(m => m.id === selectedMethodId)?.name}.
                    {'\n'}2. Escanea este código QR.
                    {'\n'}3. Confirma el pago de S/ {total?.toFixed(2)}.
                    {'\n'}4. Guarda una captura del comprobante.
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* El botón de abajo ahora navega a la siguiente pantalla */}
          {selectedMethodId && (
            <View style={styles.bottomContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleContinue}
              >
                <Text style={styles.confirmButtonText}>Subir Comprobante</Text>
                <Ionicons name="arrow-forward-circle" size={24} color="white" style={{marginLeft: 8}}/>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PaymentScreen;