// frontend/screens/CartScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCart } from '../services/cartService';

// Función para construir la URL de la imagen
const getImageUrl = (imageName) => {
  if (!imageName) return null;
  return `http://localhost:8000/static/imagenes/plato/${imageName}`;
};

const CartScreen = ({ route }) => {
  const { clienteId } = route.params || {};
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    if (!clienteId) {
      setLoading(false);
      return;
    }
    try {
      const data = await getCart(clienteId);
      setCart(data);
    } catch (error) {
      console.error("Error cargando carrito", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadCart();
    }, [clienteId])
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Tu carrito está vacío.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Tu Carrito</Text>
      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.detalle_id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
            <Image source={{ uri: getImageUrl(item.imagen) }} style={{ width: 60, height: 60, borderRadius: 10 }} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.nombre}</Text>
              <Text>{item.cantidad} x S/ {item.precio_unitario.toFixed(2)}</Text>
            </View>
            <Text style={{ fontWeight: 'bold' }}>S/ {item.subtotal.toFixed(2)}</Text>
          </View>
        )}
      />
      <View style={{ borderTopWidth: 1, borderColor: '#ccc', paddingTop: 15, marginTop: 15 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'right' }}>Total: S/ {cart.total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

export default CartScreen;