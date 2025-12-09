// frontend/components/ProductCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/productCardStyles';

const ProductCard = ({ item }) => {
  const navigation = useNavigation();
  if (!item) return null;

  const imageSource = item.imagen ? { uri: item.imagen } : require('../assets/placeholder.png');

  const handlePress = () => {
    navigation.navigate('ProductDetail', { productId: item.id });
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={handlePress}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.title}>{item.nombre}</Text>
      <Text style={styles.subtitle}>{item.descripcion}</Text>
      <Text style={styles.price}>S/ {item.precio?.toFixed(2) || '0.00'}</Text>
      
      <View style={styles.footer}>
        <Text style={styles.addToCartText}>AGREGAR AL CARRITO</Text>
        <Text style={styles.seeMoreText}>Ver más →</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;