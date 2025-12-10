// frontend/services/favoriteService.js

import api from './api';

/**
 * Agrega un plato a favoritos
 * @param {string} clienteId - ID del cliente
 * @param {string} platoId - ID del plato
 * @returns {Promise<Object>}
 */
export const addFavorite = async (clienteId, platoId) => {
  try {
    const response = await api.post(
      `/cliente/favoritos/${clienteId}/${platoId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      '❌ Error al agregar favorito:',
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Elimina un plato de favoritos
 * @param {string} clienteId - ID del cliente
 * @param {string} platoId - ID del plato
 * @returns {Promise<Object>}
 */
export const removeFavorite = async (clienteId, platoId) => {
  try {
    const response = await api.delete(
      `/cliente/favoritos/${clienteId}/${platoId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      '❌ Error al eliminar favorito:',
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Obtiene todos los favoritos de un cliente
 * @param {string} clienteId - ID del cliente
 * @returns {Promise<Object>}
 */
export const getFavorites = async (clienteId) => {
  try {
    const response = await api.get(
      `/cliente/favoritos/${clienteId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      '❌ Error al obtener favoritos:',
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Verifica si un plato está en favoritos
 * @param {string} clienteId - ID del cliente
 * @param {string} platoId - ID del plato
 * @returns {Promise<Object>}
 */
export const checkFavorite = async (clienteId, platoId) => {
  try {
    const response = await api.get(
      `/cliente/favoritos/${clienteId}/check/${platoId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      '❌ Error al verificar favorito:',
      error.response?.data || error.message
    );
    throw error;
  }
};
