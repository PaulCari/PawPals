// Archivo: src/screens/ProductDetailScreen.js
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
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Imports de Lógica y Estilos
import { styles } from '../styles/productDetailScreenStyles';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import { API_URL } from '../services/api';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

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

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product);

    Alert.alert(
      "¡Añadido! 🐾",
      `Se agregó ${product.nombre} al carrito.`,
      [
        { text: "Seguir viendo", style: "cancel" },
        { text: "Ir a Pagar", onPress: () => navigation.navigate('Cart') }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#875686" style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#999', fontSize: 16 }}>Producto no encontrado</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
            <Text style={{ color: '#875686', fontWeight: 'bold' }}>← Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const imageSource = product.imagen
    ? { uri: `${API_URL}/static/${product.imagen}` }
    : require('../assets/placeholder.png');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#875686" />
      
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={28} color="white" />
      </TouchableOpacity>

      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 20 }}>
        
        {/* HEADER DECORATIVO */}
        <View style={styles.backgroundHeader}>
          <Image source={require('../assets/ellipse.png')} style={styles.ellipseImage} />
          <Text style={styles.headerTitle}>DETALLES DEL PLATO</Text>
        </View>

        {/* CONTENIDO PRINCIPAL */}
        <View style={styles.contentContainer}>
          
          <Image source={imageSource} style={styles.productImage} />
          <TouchableOpacity style={styles.favoriteButton}>
             <Ionicons name="heart" size={24} color="#FFD100" />
          </TouchableOpacity>

          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.nombre}</Text>
            <Text style={styles.productPrice}>S/. {parseFloat(product.precio).toFixed(2)}</Text>

            {/* Etiquetas */}
            {product.etiquetas && product.etiquetas.length > 0 && (
              <View style={styles.tagsContainer}>
                {product.etiquetas.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Descripción */}
            {product.descripcion ? (
              <>
                <Text style={styles.descriptionTitle}>Acerca de este plato</Text>
                <Text style={styles.descriptionText}>{product.descripcion}</Text>
              </>
            ) : null}
          </View>
        </View>

        {/* FOOTER CON BOTÓN */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Ionicons name="cart" size={24} color="#FFD100" />
            <Text style={styles.addToCartButtonText}>Agregar al Carrito</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

export default ProductDetailScreen;