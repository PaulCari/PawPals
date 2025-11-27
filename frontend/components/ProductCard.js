// src/components/ProductCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/productCardStyles';

/**
 * Componente que muestra la tarjeta de un producto (plato).
 * 
 * @param {Object} props
 * @param {Object} props.item - Objeto del producto recibido del backend.
 */
const ProductCard = ({ item }) => {
  const navigation = useNavigation();

  if (!item) return null;

  // 🔹 Asegurar que la imagen se cargue correctamente o mostrar un placeholder
  const imageSource =
    item.imagen
      ? { uri: item.imagen }
      : require('../assets/placeholder.png'); // Usa un placeholder local si no hay imagen

  // 🔹 Función para navegar a la pantalla de detalle
  const handlePress = () => {
    navigation.navigate('ProductDetail', { productId: item.id });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.cardContainer}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />

        <Text style={styles.title} numberOfLines={1}>
          {item.nombre}
        </Text>

        {item.descripcion ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.descripcion}
          </Text>
        ) : null}

        <Text style={styles.price}>S/ {item.precio?.toFixed(2) || '0.00'}</Text>

        <View style={styles.actionsContainer}>
          <Text style={styles.addToCartText}>AGREGAR AL CARRITO</Text>
          <Text style={styles.seeMoreText}>Ver más →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
