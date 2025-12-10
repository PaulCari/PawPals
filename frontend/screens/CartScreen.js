// Archivo: src/screens/CartScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import { styles } from '../styles/CartScreenStyles';

// Importamos la URL centralizada desde tu api.js
import { API_URL } from '../services/api'; 

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Carrito vacío", "Agrega productos antes de comprar.");
      return;
    }

    setLoading(true);
    try {
      // ⚠️ ID TEMPORALES: Cambiar cuando tengas autenticación completa y direcciones
      const clienteId = "1"; 
      const direccionId = 1;

      // Construir payload según el Schema de Python
      const payload = {
        direccion_id: direccionId,
        platos: cartItems.map(item => ({
          plato_id: item.id,
          cantidad: item.quantity
        }))
      };

      const response = await createOrder(clienteId, payload);

      Alert.alert("¡Pedido Exitoso! 🎉", `Tu pedido #${response.pedido_id} está en proceso.`);
      clearCart();
      navigation.navigate('Home');

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo procesar el pedido. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tu Carrito</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {cartItems.length === 0 ? (
        // ESTADO VACÍO
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#ddd" />
          <Text style={styles.emptyText}>Tu carrito está vacío</Text>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.continueButtonText}>Ir a comprar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // LISTA Y FOOTER
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.itemCard}>
                {/* Imagen */}
                {item.imagen ? (
                   <Image 
                     source={{ uri: `${API_URL}/static/${item.imagen}` }} 
                     style={styles.itemImage} 
                   />
                ) : (
                   <View style={styles.itemImage} /> 
                )}
                
                {/* Info */}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.nombre}</Text>
                  <Text style={styles.itemPrice}>S/. {item.precio}</Text>
                </View>

                {/* Cantidad */}
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityText}>x{item.quantity}</Text>
                </View>

                {/* Botón Eliminar */}
                <TouchableOpacity 
                  onPress={() => removeFromCart(item.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total estimado:</Text>
              <Text style={styles.totalAmount}>S/. {getTotalPrice().toFixed(2)}</Text>
            </View>

            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.checkoutButtonText}>Confirmar Pedido</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}