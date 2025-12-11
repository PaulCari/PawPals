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
import { useFocusEffect } from '@react-navigation/native';
import { getAddresses } from '../services/addressService';
import { getCart, checkout } from '../services/cartService';
import { styles } from '../styles/checkoutScreenStyles';

const CheckoutScreen = ({ navigation, route }) => {
  const { clienteId } = route.params || {};
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

  useFocusEffect(
    React.useCallback(() => {
      console.log('📦 Checkout enfocado - Recargando datos...');
      loadCheckoutData();
    }, [clienteId])
  );

  const loadCheckoutData = async () => {
    try {
      console.log('📦 Cargando datos de checkout para cliente:', clienteId);
      const cartData = await getCart(clienteId);
      console.log('🛒 Carrito cargado:', cartData.items.length, 'items');
      setCart(cartData);
      const addressesData = await getAddresses(clienteId);
      console.log('📍 Direcciones obtenidas:', addressesData.length);
      setAddresses(addressesData);
      const mainAddress = addressesData.find(addr => addr.es_principal);
      if (mainAddress) {
        console.log('✅ Dirección principal encontrada:', mainAddress.nombre);
        setSelectedAddress(mainAddress.id);
      } else if (addressesData.length > 0) {
        console.log('✅ Seleccionando primera dirección:', addressesData[0].nombre);
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
    console.log('🔘 Botón "Confirmar Pedido" presionado');
    console.log('📍 Dirección seleccionada:', selectedAddress);
    console.log('🛒 Items en carrito:', cart.items.length);
    console.log('💰 Total:', cart.total);
    
    if (!selectedAddress) {
      Alert.alert('Dirección requerida', 'Por favor selecciona una dirección de entrega.');
      return;
    }
    
    if (!cart.items || cart.items.length === 0) {
      Alert.alert('Carrito vacío', 'No hay productos en tu carrito.');
      return;
    }
    
    console.log('✅ Validaciones pasadas - Procesando pedido directamente...');
    await processOrder();
  };

  const processOrder = async () => {
    console.log('═══════════════════════════════════════');
    console.log('🚀 INICIANDO PROCESO DE PEDIDO');
    console.log('═══════════════════════════════════════');
    setProcessing(true);
    try {
      console.log('📋 Datos del pedido:');
      console.log('  - Cliente ID:', clienteId);
      console.log('  - Dirección ID:', selectedAddress);
      console.log('  - Total items:', cart.items.length);
      console.log('  - Total a pagar:', cart.total);
      console.log('📡 Enviando pedido al backend...');
      const result = await checkout(clienteId, selectedAddress);
      console.log('✅ PEDIDO CREADO EXITOSAMENTE');
      console.log('📦 Pedido ID:', result.pedido_id);
      console.log('🔀 Navegando a Payment con:');
      const paymentParams = { clienteId, pedidoId: result.pedido_id, direccionId: selectedAddress, total: cart.total };
      console.log('   Parámetros:', paymentParams);
      navigation.navigate('Payment', paymentParams);
      console.log('✅ Navegación exitosa');
      console.log('═══════════════════════════════════════');
    } catch (error) {
      console.log('═══════════════════════════════════════');
      console.log('❌ ERROR AL CREAR PEDIDO');
      console.log('═══════════════════════════════════════');
      console.error('Error completo:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      console.error('Status code:', error.response?.status);
      console.log('═══════════════════════════════════════');
      const errorMessage = error.response?.data?.detail || error.message || 'No se pudo crear el pedido.';
      Alert.alert('Error en el pedido', errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleAddAddress = () => { navigation.navigate('AddAddress', { clienteId }); };
  const handleEditAddress = (address) => { navigation.navigate('AddAddress', { clienteId, addressId: address.id, existingAddress: address }); };

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
      <ImageBackground source={require('../assets/FONDOA.png')} style={styles.backgroundImage} resizeMode="cover" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finalizar Pedido</Text>
        <View style={{ width: 30 }}></View>
      </View>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
                <Text style={styles.noAddressText}>No tienes direcciones registradas</Text>
                <TouchableOpacity style={styles.addAddressButton} onPress={handleAddAddress}>
                  <Text style={styles.addAddressButtonText}>Agregar Dirección</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.addressList}>
                {addresses.map((address) => (
                  <View key={address.id} style={styles.addressCardWrapper}>
                    <TouchableOpacity style={[styles.addressCard, selectedAddress === address.id && styles.addressCardSelected]} onPress={() => { console.log('📍 Dirección seleccionada:', address.id, '-', address.nombre); setSelectedAddress(address.id); }}>
                      <View style={styles.radioButton}>
                        {selectedAddress === address.id && (<View style={styles.radioButtonInner} />)}
                      </View>
                      <View style={styles.addressInfo}>
                        <View style={styles.addressHeader}>
                          <Text style={styles.addressName}>{address.nombre}</Text>
                          {address.es_principal && (<View style={styles.principalBadge}><Text style={styles.principalBadgeText}>Principal</Text></View>)}
                        </View>
                        {address.referencia && (<Text style={styles.addressReference}>{address.referencia}</Text>)}
                      </View>
                      <Ionicons name="location-sharp" size={24} color={selectedAddress === address.id ? '#875686' : '#ccc'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editAddressButton} onPress={() => handleEditAddress(address)}>
                      <Ionicons name="create-outline" size={20} color="#875686" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Productos</Text>
            {cart.items.map((item) => {
              const imageSource = item.imagen ? { uri: item.imagen } : require('../assets/placeholder.png');
              return (
                <View key={item.plato_id} style={styles.productItem}>
                  <Image source={imageSource} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{item.nombre}</Text>
                    <Text style={styles.productPrice}>S/ {item.precio_unitario.toFixed(2)} x {item.cantidad}</Text>
                  </View>
                  <Text style={styles.productSubtotal}>S/ {item.subtotal.toFixed(2)}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={[styles.confirmButton, (processing || addresses.length === 0 || !selectedAddress) && styles.confirmButtonDisabled]} onPress={handleConfirmOrder} disabled={processing || addresses.length === 0 || !selectedAddress}>
            {processing ? (<ActivityIndicator color="white" />) : (<><Ionicons name="checkmark-circle" size={24} color="white" /><Text style={styles.confirmButtonText}>Confirmar Pedido</Text></>)}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;