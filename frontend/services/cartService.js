// frontend/services/cartService.js
import api from './api';

export const getCart = async (clienteId) => {
  try {
    const response = await api.get(`/cliente/carrito/${clienteId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener el carrito:', error.response?.data || error.message);
    throw error;
  }
};

export const addToCart = async (clienteId, platoId, cantidad) => {
  try {
    const response = await api.post('/cliente/carrito/agregar', {
      cliente_id: clienteId,
      plato_id: platoId,
      cantidad: cantidad,
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error al agregar al carrito:', error.response?.data || error.message);
    throw error;
  }
};