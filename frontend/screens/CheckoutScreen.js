// frontend/screens/CheckoutScreen.js

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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; // ✅ NUEVO

import { getAddresses } from '../services/addressService';
import { getCart, checkout } from '../services/cartService';
import { styles } from '../styles/checkoutScreenStyles';

const CheckoutScreen = ({ navigation, route }) => {
  const { clienteId } = route.params || {};

  // Estados
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0 });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!clienteId) {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      navigation.goBack();
      return;
    }
  }, [clienteId]);

  // ✅ ACTUALIZAR: Recargar cuando la pantalla recibe foco
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 Checkout enfocado - Recargando datos...');
      loadCheckoutData();
    }, [clienteId])
  );

  const loadCheckoutData = async () => {
    try {
      console.log('📦 Cargando datos de checkout para cliente:', clienteId);

      // Cargar carrito
      const cartData = await getCart(clienteId);
      setCart(cartData);

      // Cargar direcciones
      const addressesData = await getAddresses(clienteId);
      setAddresses(addressesData);

      // Seleccionar dirección principal por defecto
      const mainAddress = addressesData.find(addr => addr.es_principal);
      if (mainAddress) {
        setSelectedAddress(mainAddress.id);
      } else if (addressesData.length > 0) {
        setSelectedAddress(addressesData[0].id);
      }

      console.log('✅ Datos de checkout cargados');
    } catch (error) {
      console.error('❌ Error cargando datos de checkout:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos necesarios.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Dirección requerida', 'Por favor selecciona una dirección de entrega.');
      return;
    }

    Alert.alert(
      'Confirmar Pedido',
      `Total a pagar: S/ ${cart.total.toFixed(2)}\n\n¿Deseas confirmar tu pedido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: processOrder,
        },
      ]
    );
  };

  const processOrder = async () => {
    setProcessing(true);
    try {
      console.log('💳 Procesando pedido...');
      const result = await checkout(clienteId, selectedAddress);

      console.log('✅ Pedido procesado exitosamente:', result);

      // Navegar a pantalla de éxito
      navigation.replace('OrderSuccess', {
        clienteId,
        pedidoId: result.pedido_id,
        total: cart.total,
      });
    } catch (error) {
      console.error('❌ Error al procesar pedido:', error);
      
      const errorMessage = error.response?.data?.detail || 
                          error.message || 
                          'No se pudo procesar el pedido.';
      
      Alert.alert('Error en el pedido', errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  // ✅ ACTUALIZAR: Navegar a AddAddressScreen
  const handleAddAddress = () => {
    navigation.navigate('AddAddress', { 
      clienteId,
      // No pasamos addressId porque es una nueva dirección
    });
  };

  // ✅ NUEVO: Editar dirección existente
  const handleEditAddress = (address) => {
    navigation.navigate('AddAddress', {
      clienteId,
      addressId: address.id,
      existingAddress: address,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#875686" />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

        <Text style={styles.headerTitle}>Finalizar Pedido</Text>

        <View style={{ width: 30 }} />
      </View>

      {/* CONTENIDO */}
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* SECCIÓN: RESUMEN DEL PEDIDO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen del Pedido</Text>
            
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Productos ({cart.items.length}):</Text>
                <Text style={styles.summaryValue}>S/ {cart.subtotal.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Envío:</Text>
                <Text style={styles.summaryValueGreen}>Gratis</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>S/ {cart.total.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* SECCIÓN: DIRECCIÓN DE ENTREGA */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Dirección de Entrega</Text>
              <TouchableOpacity onPress={handleAddAddress}>
                <Ionicons name="add-circle-outline" size={28} color="#875686" />
              </TouchableOpacity>
            </View>

            {addresses.length === 0 ? (
              <View style={styles.noAddressContainer}>
                <Ionicons name="location-outline" size={60} color="#ccc" />
                <Text style={styles.noAddressText}>
                  No tienes direcciones registradas
                </Text>
                <TouchableOpacity style={styles.addAddressButton} onPress={handleAddAddress}>
                  <Text style={styles.addAddressButtonText}>Agregar Dirección</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.addressList}>
                {addresses.map((address) => (
                  <View key={address.id} style={styles.addressCardWrapper}>
                    <TouchableOpacity
                      style={[
                        styles.addressCard,
                        selectedAddress === address.id && styles.addressCardSelected,
                      ]}
                      onPress={() => setSelectedAddress(address.id)}
                    >
                      <View style={styles.radioButton}>
                        {selectedAddress === address.id && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>

                      <View style={styles.addressInfo}>
                        <View style={styles.addressHeader}>
                          <Text style={styles.addressName}>{address.nombre}</Text>
                          {address.es_principal && (
                            <View style={styles.principalBadge}>
                              <Text style={styles.principalBadgeText}>Principal</Text>
                            </View>
                          )}
                        </View>
                        {address.referencia && (
                          <Text style={styles.addressReference}>{address.referencia}</Text>
                        )}
                      </View>

                      <Ionicons
                        name="location-sharp"
                        size={24}
                        color={selectedAddress === address.id ? '#875686' : '#ccc'}
                      />
                    </TouchableOpacity>

                    {/* ✅ NUEVO: Botón editar */}
                    <TouchableOpacity
                      style={styles.editAddressButton}
                      onPress={() => handleEditAddress(address)}
                    >
                      <Ionicons name="create-outline" size={20} color="#875686" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* LISTA DE PRODUCTOS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Productos</Text>
            {cart.items.map((item) => {
              const imageSource = item.imagen
                ? { uri: item.imagen }
                : require('../assets/placeholder.png');

              return (
                <View key={item.plato_id} style={styles.productItem}>
                  <Image source={imageSource} style={styles.productImage} />
                  
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.nombre}
                    </Text>
                    <Text style={styles.productPrice}>
                      S/ {item.precio_unitario.toFixed(2)} x {item.cantidad}
                    </Text>
                  </View>
                  
                  <Text style={styles.productSubtotal}>
                    S/ {item.subtotal.toFixed(2)}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* BOTÓN CONFIRMAR PEDIDO */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              (processing || addresses.length === 0) && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirmOrder}
            disabled={processing || addresses.length === 0}
          >
            {processing ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;