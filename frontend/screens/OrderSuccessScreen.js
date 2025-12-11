// frontend/screens/OrderSuccessScreen.js

import React, { useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/orderSuccessScreenStyles';

const OrderSuccessScreen = ({ navigation, route }) => {
  const { clienteId, pedidoId, total } = route.params || {};

  // Animación de entrada
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main', params: { clienteId } }],
    });
  };

  const handleViewOrders = () => {
    // TODO: Implementar navegación a historial de pedidos
    handleGoHome();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ÍCONO DE ÉXITO ANIMADO */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={80} color="white" />
          </View>
        </Animated.View>

        {/* MENSAJE */}
        <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>¡Pedido Realizado!</Text>
          <Text style={styles.subtitle}>
            Tu pedido ha sido procesado exitosamente
          </Text>

          {/* INFORMACIÓN DEL PEDIDO */}
          <View style={styles.orderInfoCard}>
            <View style={styles.orderInfoRow}>
              <Text style={styles.orderInfoLabel}>Número de Pedido:</Text>
              <Text style={styles.orderInfoValue}>#{pedidoId || 'N/A'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.orderInfoRow}>
              <Text style={styles.orderInfoLabel}>Total Pagado:</Text>
              <Text style={styles.orderInfoValueHighlight}>
                S/ {total?.toFixed(2) || '0.00'}
              </Text>
            </View>
          </View>

          {/* MENSAJE ADICIONAL */}
          <View style={styles.additionalInfo}>
            <Ionicons name="time-outline" size={24} color="#875686" />
            <Text style={styles.additionalInfoText}>
              Recibirás una notificación cuando tu pedido esté en camino
            </Text>
          </View>
        </Animated.View>

        {/* BOTONES */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGoHome}
          >
            <Ionicons name="home" size={24} color="white" />
            <Text style={styles.primaryButtonText}>Volver al Inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleViewOrders}
          >
            <Ionicons name="receipt-outline" size={24} color="#875686" />
            <Text style={styles.secondaryButtonText}>Ver Mis Pedidos</Text>
          </TouchableOpacity>
        </View>

        {/* DECORACIÓN */}
        <View style={styles.decorationCircle1} />
        <View style={styles.decorationCircle2} />
      </View>
    </SafeAreaView>
  );
};

export default OrderSuccessScreen;