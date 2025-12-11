// frontend/screens/CartScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import {
  getCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  checkout
} from '../services/cartService';

import { styles } from '../styles/cartScreenStyles';

const CartScreen = ({ navigation, route }) => {
  const { clienteId } = route.params || {};
  
  // Estados
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  // Verificar clienteId
  useEffect(() => {
    if (!clienteId) {
      console.error('❌ No se recibió clienteId en CartScreen');
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      navigation.goBack();
    } else {
      console.log('✅ CartScreen iniciado con clienteId:', clienteId);
    }
  }, [clienteId]);

  // Cargar carrito al entrar a la pantalla
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Cargando carrito...');
      loadCart();
    }, [clienteId])
  );

  const loadCart = async () => {
    if (!clienteId) {
      console.error('❌ No hay clienteId para cargar carrito');
      return;
    }
    
    try {
      console.log('📦 Obteniendo carrito para cliente:', clienteId);
      const cartData = await getCart(clienteId);
      console.log('✅ Carrito obtenido:', cartData.items.length, 'items');
      setCart(cartData);
    } catch (error) {
      console.error('❌ Error cargando carrito:', error);
      Alert.alert('Error', 'No se pudo cargar el carrito.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCart();
  };

  // Incrementar cantidad
  const handleIncrement = async (platoId, currentQuantity) => {
    try {
      console.log('➕ Incrementando cantidad de:', platoId);
      const updatedCart = await updateCartItemQuantity(
        clienteId,
        platoId,
        currentQuantity + 1
      );
      setCart(updatedCart);
      console.log('✅ Cantidad incrementada');
    } catch (error) {
      console.error('❌ Error al incrementar:', error);
      Alert.alert('Error', 'No se pudo actualizar la cantidad.');
    }
  };

  // Decrementar cantidad
  const handleDecrement = async (platoId, currentQuantity) => {
    if (currentQuantity <= 1) {
      handleRemoveItem(platoId);
      return;
    }
    
    try {
      const updatedCart = await updateCartItemQuantity(
        clienteId,
        platoId,
        currentQuantity - 1
      );
      setCart(updatedCart);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la cantidad.');
    }
  };

  // Eliminar un item específico
  const handleRemoveItem = async (platoId) => {
    const item = cart.items.find(i => i.plato_id === platoId);
    
    Alert.alert(
      "Eliminar Producto",
      `¿Deseas eliminar "${item?.nombre}" del carrito?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedCart = await removeFromCart(clienteId, platoId);
              setCart(updatedCart);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el producto.');
            }
          }
        }
      ]
    );
  };

  // Vaciar todo el carrito
  const handleClearCart = () => {
    Alert.alert(
      "Vaciar Carrito",
      "¿Estás seguro de que deseas eliminar todos los productos del carrito?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Vaciar",
          style: "destructive",
          onPress: async () => {
            try {
              const emptyCart = await clearCart(clienteId);
              setCart(emptyCart);
            } catch (error) {
              Alert.alert('Error', 'No se pudo vaciar el carrito.');
            }
          }
        }
      ]
    );
  };

  // Finalizar compra
  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos antes de continuar.');
      return;
    }

    // TODO: Aquí deberías mostrar una pantalla para seleccionar dirección
    // Por ahora, simularemos con una dirección por defecto
    Alert.alert(
      "Finalizar Compra",
      `Total: S/ ${cart.total.toFixed(2)}\n\n¿Deseas proceder con el pago?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            setProcessingCheckout(true);
            try {
              // Aquí necesitarías obtener la dirección del cliente
              // const direccionId = "...";
              // const result = await checkout(clienteId, direccionId);
              
              // Por ahora simulamos éxito
              Alert.alert(
                "¡Pedido Realizado!",
                "Tu pedido ha sido procesado exitosamente.",
                [
                  {
                    text: "Ver Pedido",
                    onPress: () => {
                      // TODO: Navegar a pantalla de pedidos
                      navigation.navigate('HomeStack');
                    }
                  }
                ]
              );
              
              // Vaciar carrito
              const emptyCart = await clearCart(clienteId);
              setCart(emptyCart);
            } catch (error) {
              Alert.alert('Error', 'No se pudo procesar el pedido.');
            } finally {
              setProcessingCheckout(false);
            }
          }
        }
      ]
    );
  };

  // Renderizar cada item del carrito
  const renderCartItem = ({ item }) => {
    const imageSource = item.imagen
      ? { uri: item.imagen }
      : require('../assets/placeholder.png');

    return (
      <View style={styles.cartItem}>
        <Image source={imageSource} style={styles.itemImage} />
        
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.nombre}
          </Text>
          <Text style={styles.itemPrice}>
            S/ {item.precio_unitario.toFixed(2)}
          </Text>
        </View>

        <View style={styles.itemActions}>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleDecrement(item.plato_id, item.cantidad)}
            >
              <Ionicons name="remove" size={20} color="white" />
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{item.cantidad}</Text>
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleIncrement(item.plato_id, item.cantidad)}
            >
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemSubtotal}>
            S/ {item.subtotal.toFixed(2)}
          </Text>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.plato_id)}
          >
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    );
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

        <Image
          source={require('../assets/logo_amarillo.png')}
          style={styles.logo}
        />

        {cart.items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Ionicons name="trash-outline" size={28} color="white" />
          </TouchableOpacity>
        )}
        {cart.items.length === 0 && <View style={{ width: 28 }} />}
      </View>

      {/* CONTENIDO */}
      <View style={styles.container}>
        {/* TÍTULO */}
        <View style={styles.titleContainer}>
          <Text style={styles.screenTitle}>Mi Carrito</Text>
          {!loading && cart.items.length > 0 && (
            <Text style={styles.countText}>
              {cart.items.length} {cart.items.length === 1 ? 'producto' : 'productos'}
            </Text>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#875686" />
            <Text style={styles.loadingText}>Cargando carrito...</Text>
          </View>
        ) : cart.items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={100} color="#ccc" />
            <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
            <Text style={styles.emptySubtitle}>
              Explora nuestros productos y agrega tus favoritos
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('HomeStack')}
            >
              <Text style={styles.exploreButtonText}>Explorar Productos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={cart.items}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.plato_id.toString()}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />

            {/* RESUMEN DEL PEDIDO */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>
                  S/ {cart.subtotal.toFixed(2)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Envío:</Text>
                <Text style={styles.summaryValue}>Gratis</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>
                  S/ {cart.total.toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.checkoutButton,
                  processingCheckout && styles.checkoutButtonDisabled
                ]}
                onPress={handleCheckout}
                disabled={processingCheckout}
              >
                {processingCheckout ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Ionicons name="card-outline" size={24} color="white" />
                    <Text style={styles.checkoutButtonText}>
                      Proceder al Pago
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;