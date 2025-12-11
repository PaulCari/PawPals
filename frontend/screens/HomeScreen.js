import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { getProducts, getCategories } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { styles } from '../styles/homeScreenStyles';

const HomeScreen = ({ navigation, route }) => {
  // ===== ESTADOS =====
  const clienteId = route.params?.clienteId;
  const [userName, setUserName] = useState('Paúl');
  const [petName, setPetName] = useState('Caramelo');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== EFECTOS =====
  useEffect(() => {
    if (!clienteId) {
      console.error('❌ No se recibió cliente_id');
    } else {
      console.log('✅ Cliente ID:', clienteId);
    }
  }, [clienteId]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        if (categoriesData.length > 0) {
          const firstCategoryId = categoriesData[0].id;
          setActiveCategoryId(firstCategoryId);
          const productsData = await getProducts({ categoria_id: firstCategoryId });
          setProducts(productsData);
        }
      } catch (error) {
        console.error('❌ Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // ===== HANDLERS =====
  const handleCategoryPress = async (categoryId) => {
    setActiveCategoryId(categoryId);
    setLoading(true);
    try {
      const productsData = await getProducts({ categoria_id: categoryId });
      setProducts(productsData);
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===== RENDER =====
  return (
    <SafeAreaView style={styles.safeArea}>

      {/* 🔥 FONDO CON IMAGEN (ABSOLUTO) */}
      <ImageBackground
        source={require('../assets/FONDOA.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* 🔹 HEADER MORADO */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}> {/*aea*/ }
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>

        <Image
          source={require('../assets/logo_amarillo.png')}
          style={styles.logo}
        />

        <TouchableOpacity>
          <Ionicons name="cart-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* 🤍 CONTENEDOR BLANCO */}
      <View style={styles.container}>
        <Text style={styles.welcomeTitle}>
          Bienvenido {userName} y {petName}!!
        </Text>

        {/* CATEGORÍAS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScrollView}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryButton}
              onPress={() => handleCategoryPress(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategoryId === category.id && styles.activeCategoryText,
                ]}
              >
                {category.nombre}
              </Text>

              {activeCategoryId === category.id && (
                <View style={styles.categoryUnderline} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* PRODUCTOS */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#875686"
            style={{ marginTop: 50 }}
          />
        ) : (
          <FlatList
            data={products}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <ProductCard
                item={item}
                clienteId={clienteId}
                isCenter={index === Math.floor(products.length / 2)}
              />
            )}
            contentContainerStyle={styles.productList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No hay productos en esta categoría.
              </Text>
            }
            snapToInterval={300}
            decelerationRate="fast"
          />
        )}
      </View>

      {/* ✅ AQUÍ VA TU BOTTOM TAB */}
    </SafeAreaView>
  );
};

export default HomeScreen;
