// frontend/screens/PaymentScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { processPayment } from '../services/paymentService';
import { styles } from '../styles/paymentScreenStyles';

const PaymentScreen = ({ navigation, route }) => {
  const { clienteId, direccionId, total, pedidoId } = route.params || {};

  // Estados
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Métodos de pago disponibles
  const paymentMethods = [
    { 
      id: '1', 
      name: 'Yape', 
      qr: require('../assets/qr/imagen1.png'),
      icon: 'phone-portrait-outline'
    },
    { 
      id: '2', 
      name: 'Plin', 
      qr: require('../assets/qr/imagen2.png'),
      icon: 'wallet-outline'
    },
  ];

  // Seleccionar imagen de comprobante
  const handleSelectProof = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso requerido',
          'Necesitamos acceso a tus fotos para subir el comprobante.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setPaymentProof(result.assets[0]);
        console.log('✅ Comprobante seleccionado');
      }
    } catch (error) {
      console.error('❌ Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  // Procesar pago
  const handleConfirmPayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Método requerido', 'Por favor selecciona un método de pago.');
      return;
    }

    if (!paymentProof) {
      Alert.alert('Comprobante requerido', 'Por favor sube una captura del pago realizado.');
      return;
    }

    Alert.alert(
      'Confirmar Pago',
      `¿Deseas confirmar el pago de S/ ${total.toFixed(2)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: processPaymentAction },
      ]
    );
  };

  const processPaymentAction = async () => {
    setProcessing(true);
    try {
      console.log('💳 Procesando pago...');
      
      const result = await processPayment(
        clienteId,
        pedidoId,
        selectedMethod,
        paymentProof
      );

      console.log('✅ Pago procesado:', result);

      // Navegar a pantalla de éxito
      navigation.replace('OrderSuccess', {
        clienteId,
        pedidoId: result.pedido_id,
        total,
      });
    } catch (error) {
      console.error('❌ Error al procesar pago:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.message || 
                          'No se pudo procesar el pago.';
      Alert.alert('Error en el pago', errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* FONDO */}
      <ImageBackground
        source={require('../assets/FONDOA.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Realizar Pago</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* CONTENIDO */}
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* RESUMEN DEL PAGO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen del Pago</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total a pagar:</Text>
                <Text style={styles.totalValue}>S/ {total?.toFixed(2) || '0.00'}</Text>
              </View>
            </View>
          </View>

          {/* SELECCIÓN DE MÉTODO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selecciona el método de pago</Text>
            <View style={styles.methodsContainer}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodCard,
                    selectedMethod === method.id && styles.methodCardSelected,
                  ]}
                  onPress={() => setSelectedMethod(method.id)}
                >
                  <View style={styles.radioButton}>
                    {selectedMethod === method.id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Ionicons 
                    name={method.icon} 
                    size={24} 
                    color={selectedMethod === method.id ? '#875686' : '#666'} 
                  />
                  <Text style={[
                    styles.methodName,
                    selectedMethod === method.id && styles.methodNameSelected
                  ]}>
                    {method.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* CÓDIGO QR */}
          {selectedMethod && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Escanea el código QR</Text>
              <View style={styles.qrCard}>
                <Image
                  source={paymentMethods.find(m => m.id === selectedMethod)?.qr}
                  style={styles.qrImage}
                />
                <Text style={styles.qrInstructions}>
                  1. Abre tu app de {paymentMethods.find(m => m.id === selectedMethod)?.name}
                  {'\n'}2. Escanea este código QR
                  {'\n'}3. Confirma el pago de S/ {total?.toFixed(2)}
                  {'\n'}4. Sube una captura del comprobante
                </Text>
              </View>
            </View>
          )}

          {/* SUBIR COMPROBANTE */}
          {selectedMethod && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Comprobante de Pago</Text>
              
              {!paymentProof ? (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleSelectProof}
                  disabled={uploading}
                >
                  {uploading ? (
                    <ActivityIndicator color="#875686" />
                  ) : (
                    <>
                      <Ionicons name="cloud-upload-outline" size={40} color="#875686" />
                      <Text style={styles.uploadText}>Subir captura del pago</Text>
                      <Text style={styles.uploadSubtext}>JPG, PNG (Máx. 5MB)</Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                <View style={styles.proofContainer}>
                  <Image source={{ uri: paymentProof.uri }} style={styles.proofImage} />
                  <TouchableOpacity
                    style={styles.changeProofButton}
                    onPress={handleSelectProof}
                  >
                    <Ionicons name="refresh" size={20} color="white" />
                    <Text style={styles.changeProofText}>Cambiar imagen</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* INFORMACIÓN ADICIONAL */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color="#875686" />
            <Text style={styles.infoText}>
              Tu pedido será procesado una vez que nuestro equipo verifique el pago.
              Recibirás una confirmación en breve.
            </Text>
          </View>
        </ScrollView>

        {/* BOTÓN CONFIRMAR */}
        {selectedMethod && paymentProof && (
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                processing && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirmPayment}
              disabled={processing}
            >
              {processing ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                  <Text style={styles.confirmButtonText}>Confirmar Pago</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;