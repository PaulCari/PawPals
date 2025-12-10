import api from './api';

/**
 * Envía el pedido al backend.
 * @param {string} clienteId 
 * @param {Object} orderData
 */
export const createOrder = async (clienteId, orderData) => {
  try {
    const response = await api.post(`/cliente/pedido/${clienteId}`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creando pedido:', error.response?.data || error.message);
    throw error;
  }
};