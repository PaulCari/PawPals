

// src/screens/ProductDetailScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/productDetailScreenStyles';
import { getProductById } from '../services/productService';

/**
 * Pantalla de detalle de producto (plato).
 * Muestra la información completa obtenida del backend.
 */
const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error('❌ Error cargando el producto:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#FFB800" style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ marginTop: 100, alignItems: 'center' }}>
          <Text style={{ color: '#999' }}>Producto no encontrado</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
            <Text style={{ color: '#FFB800' }}>← Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 🔹 Fallback de imagen
  const imageSource = product.imagen
    ? { uri: product.imagen }
    : require('../assets/placeholder.png');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} bounces={false}>
        {/* === FONDO DECORATIVO === */}
        <View style={styles.backgroundHeader}>
          <Image source={require('../assets/ellipse.png')} style={styles.ellipseImage} />
          <Image source={require('../assets/logo_amarillo.png')} style={styles.yellowShape} />
          <Text style={styles.headerTitle}>DETALLE PLATO</Text>
        </View>

        {/* === CONTENIDO PRINCIPAL === */}
        <View style={styles.contentContainer}>
          {/* Botón Volver */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Favorito (decorativo) */}
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={28} color={styles.favoriteButton.color} />
          </TouchableOpacity>

          {/* Imagen */}
          <Image source={imageSource} style={styles.productImage} resizeMode="cover" />

          {/* Información del producto */}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.nombre}</Text>
            <Text style={styles.productPrice}>S/ {product.precio?.toFixed(2) || '0.00'}</Text>

            {product.descripcion ? (
              <>
                <Text style={styles.descriptionTitle}>Descripción:</Text>
                <Text style={styles.descriptionText}>{product.descripcion}</Text>
              </>
            ) : null}

            {/* Etiquetas */}
            {product.etiquetas?.length > 0 && (
              <View style={styles.tagsContainer}>
                {product.etiquetas.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Botón al final */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.addToCartButton}>
            <Text style={styles.addToCartButtonText}>Agregar al carrito</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;

