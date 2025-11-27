// src/services/productService.js
import api from './api'; // instancia de axios preconfigurada con la baseURL del backend

/**
 * 🔹 Obtiene todos los productos (platos) filtrados opcionalmente.
 * Endpoint: GET /cliente/platos-mascotas
 * 
 * @param {Object} [filters] - Filtros para la búsqueda.
 * @param {string} [filters.categoria_id] - ID de la categoría.
 * @param {string} [filters.especie_id] - ID de la especie.
 * @param {Array<string>} [filters.etiquetas] - IDs de etiquetas.
 * @param {string} [filters.search] - Texto libre de búsqueda.
 * @returns {Promise<Array>} Lista de productos.
 */
export const getProducts = async (filters = {}) => {
  try {
    const response = await api.get('/cliente/platos-mascotas/', { params: filters });
    return response.data;
  } catch (error) {
    console.error('❌ Error en getProducts:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 Obtiene el detalle de un producto específico.
 * Endpoint: GET /cliente/platos-mascotas/id/{plato_id}
 * 
 * @param {string} productId - ID del producto a obtener.
 * @returns {Promise<Object>} Detalle del producto.
 */
export const getProductById = async (productId) => {
  try {
    const response = await api.get(`/cliente/platos-mascotas/id/${productId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error en getProductById:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 Obtiene todas las categorías activas.
 * Endpoint: GET /cliente/platos-mascotas/categorias
 * 
 * @returns {Promise<Array>} Lista de categorías.
 */
export const getCategories = async () => {
  try {
    const response = await api.get('/cliente/platos-mascotas/categorias');
    return response.data;
  } catch (error) {
    console.error('❌ Error en getCategories:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 Obtiene las especies activas (Perros, Gatos, etc.)
 * Endpoint: GET /cliente/platos-mascotas/especies
 * 
 * @returns {Promise<Array>} Lista de especies.
 */
export const getSpecies = async () => {
  try {
    const response = await api.get('/cliente/platos-mascotas/especies');
    return response.data;
  } catch (error) {
    console.error('❌ Error en getSpecies:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 Obtiene las etiquetas activas relacionadas con platos publicados.
 * Endpoint: GET /cliente/platos-mascotas/etiquetas
 * 
 * @returns {Promise<Array>} Lista de etiquetas.
 */
export const getTags = async () => {
  try {
    const response = await api.get('/cliente/platos-mascotas/etiquetas');
    return response.data;
  } catch (error) {
    console.error('❌ Error en getTags:', error.response?.data || error.message);
    throw error;
  }
};
