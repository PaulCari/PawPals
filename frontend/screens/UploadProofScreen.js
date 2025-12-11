// frontend/screens/UploadProofScreen.js (VERSIÓN FINAL Y ROBUSTA)
import React, { useState, useEffect } from 'react';
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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { processPayment } from '../services/paymentService';
import { styles } from '../styles/paymentScreenStyles';

const UploadProofScreen = ({ navigation, route }) => {
  const { clienteId, pedidoId, total, paymentMethod } = route.params || {};

  const [paymentProof, setPaymentProof] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Verificación de que los parámetros llegan correctamente al montar la pantalla
  useEffect(() => {
    if (!clienteId || !pedidoId || !total || !paymentMethod) {
      console.error("❌ Faltan parámetros esenciales en UploadProofScreen:", route.params);
      Alert.alert(
        "Error de navegación",
        "Faltan datos para procesar el pago. Por favor, vuelve a intentarlo desde el checkout.",
        [{ text: "Volver", onPress: () => navigation.goBack() }]
      );
    }
  }, []);


  const handleSelectProof = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a tus fotos para subir el comprobante.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log("✅ Imagen seleccionada:", result.assets[0].uri);
        setPaymentProof(result.assets[0]);
      }
    } catch (error) {
      console.error('❌ Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  // ✅ SOLUCIÓN: La lógica se mueve a una función que se llama desde el Alert.
  // Esto asegura que siempre se ejecute con el estado más reciente.
  const processPaymentAction = async () => {
    // Doble verificación por si acaso
    if (!paymentProof) {
        Alert.alert('Error', 'No se encontró el comprobante para enviar.');
        return;
    }

    console.log('🚀 Iniciando procesamiento de pago...');
    setProcessing(true);
    
    try {
      const result = await processPayment(
        clienteId, 
        pedidoId, 
        paymentMethod.id, 
        paymentProof
      );
      
      console.log('✅ Pago procesado exitosamente en el backend.');
      setProcessing(false);
      
      Alert.alert(
        '🎉 ¡Compra Exitosa!',
        'Tu pago ha sido procesado correctamente.\n\nRecibirás una confirmación cuando validemos tu comprobante.',
        [
          {
            text: 'Ver Detalles',
            onPress: () => {
              console.log('📱 Navegando a la pantalla de éxito...');
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'OrderSuccess',
                    params: {
                      clienteId,
                      pedidoId: result.pedido_id || pedidoId,
                      total,
                      metodoPago: paymentMethod.name,
                    }
                  }
                ],
              });
            }
          }
        ],
        { cancelable: false }
      );
      
    } catch (error) {
      console.error('❌ Error al procesar pago:', error.response?.data || error.message);
      setProcessing(false);
      
      const errorMessage = error.response?.data?.detail 
        || error.message 
        || 'No se pudo procesar el pago.';
      
      Alert.alert(
        'Error en el pago', 
        errorMessage,
        [{ text: 'OK' }]
      );
    }
  };


  const handleConfirmPayment = () => {
    console.log("--- DEBUG: Botón 'Confirmar Pago' presionado ---");
    console.log("--- DEBUG: Verificando 'paymentProof' state:", paymentProof ? `URI: ${paymentProof.uri}` : 'null');

    if (!paymentProof) {
      Alert.alert('Comprobante requerido', 'Por favor sube una captura del pago realizado.');
      return;
    }
    
    Alert.alert(
      'Confirmar Pago',
      `¿Deseas confirmar el pago de S/ ${total.toFixed(2)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        // ✅ Se llama a la función de procesamiento directamente desde el onPress
        { text: 'Confirmar', onPress: processPaymentAction },
      ]
    );
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
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.paymentTitle}>Sube tu Comprobante</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resumen</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total a pagar:</Text>
                  <Text style={styles.totalValue}>S/ {total?.toFixed(2) || '0.00'}</Text>
                </View>
                <View style={[styles.summaryRow, { marginTop: 10 }]}>
                  <Text style={styles.summaryLabel}>Método:</Text>
                  <Text style={[styles.summaryLabel, {color: '#875686'}]}>{paymentMethod?.name}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Comprobante de Pago</Text>
              {!paymentProof ? (
                <TouchableOpacity style={styles.uploadButton} onPress={handleSelectProof}>
                  <Ionicons name="cloud-upload-outline" size={40} color="#875686" />
                  <Text style={styles.uploadText}>Subir captura del pago</Text>
                  <Text style={styles.uploadSubtext}>JPG, PNG (Máx. 5MB)</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.proofContainer}>
                  <Image source={{ uri: paymentProof.uri }} style={styles.proofImage} />
                  <TouchableOpacity style={styles.changeProofButton} onPress={handleSelectProof}>
                    <Ionicons name="refresh" size={20} color="white" />
                    <Text style={styles.changeProofText}>Cambiar imagen</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={24} color="#875686" />
              <Text style={styles.infoText}>
                Tu pedido será procesado una vez que nuestro equipo verifique el pago. Recibirás una confirmación en breve.
              </Text>
            </View>
          </ScrollView>

          {/* El botón de confirmar ahora vive aquí */}
          {paymentProof && (
            <View style={styles.bottomContainer}>
              <TouchableOpacity
                style={[styles.confirmButton, processing && styles.confirmButtonDisabled]}
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
    </View>
  );
};

export default UploadProofScreen;