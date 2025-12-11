// frontend/components/CartBadge.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCartItemCount } from '../services/cartService';

/**
 * 🛒 Badge que muestra la cantidad de items en el carrito
 * Úsalo envolviendo el ícono del carrito
 */
const CartBadge = ({ clienteId, children }) => {
  const [itemCount, setItemCount] = useState(0);

  // Cargar al montar el componente
  useEffect(() => {
    loadItemCount();
  }, [clienteId]);

  // Actualizar cada vez que la pantalla esté en foco
  useFocusEffect(
    React.useCallback(() => {
      loadItemCount();
      
      // Actualizar cada 3 segundos mientras la pantalla está activa
      const interval = setInterval(loadItemCount, 3000);
      
      return () => clearInterval(interval);
    }, [clienteId])
  );

  const loadItemCount = async () => {
    if (!clienteId) {
      setItemCount(0);
      return;
    }
    
    try {
      const count = await getCartItemCount(clienteId);
      setItemCount(count);
    } catch (error) {
      console.error('❌ Error al cargar contador del carrito:', error);
      setItemCount(0);
    }
  };

  return (
    <View style={styles.container}>
      {children}
      {itemCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {itemCount > 99 ? '99+' : itemCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default CartBadge;