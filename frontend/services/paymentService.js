// frontend/services/paymentService.js

import api from './api';
import { clearCart } from './cartService';

/**
 * 💳 SERVICIO DE PAGOS
 * Maneja el procesamiento de pagos y comprobantes
 */

/**
 * Procesa un pago y sube el comprobante
 * @param {string} clienteId - ID del cliente
 * @param {string} pedidoId - ID del pedido
 * @param {string} metodoPagoId - ID del método de pago (1=Yape, 2=Plin)
 * @param {Object} comprobante - Objeto con la imagen del comprobante
 * @returns {Promise<Object>}
 */
export const processPayment = async (clienteId, pedidoId, metodoPagoId, comprobante) => {
  try {
    if (!clienteId || !pedidoId || !metodoPagoId) {
      throw new Error('Datos incompletos para procesar el pago');
    }

    console.log('💳 Procesando pago:', {
      clienteId,
      pedidoId,
      metodoPagoId,
      comprobanteUri: comprobante?.uri
    });

    // Crear FormData para enviar la imagen
    const formData = new FormData();
    formData.append('pasarela_pago_id', metodoPagoId);
    
    // Agregar la imagen del comprobante
    if (comprobante && comprobante.uri) {
      const uriParts = comprobante.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('comprobante', {
        uri: comprobante.uri,
        name: `comprobante_${pedidoId}.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    // Enviar al backend
    const response = await api.post(
      `/cliente/pedido/${pedidoId}/pagar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('✅ Pago procesado exitosamente:', response.data);

    // Vaciar el carrito después de confirmar el pago
    await clearCart(clienteId);
    console.log('🗑️ Carrito vaciado');

    return response.data;
  } catch (error) {
    console.error('❌ Error al procesar pago:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Obtiene el historial de pagos de un cliente
 * @param {string} clienteId - ID del cliente
 * @returns {Promise<Array>}
 */
export const getPaymentHistory = async (clienteId) => {
  try {
    const response = await api.get(`/cliente/${clienteId}/pagos`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener historial de pagos:', error);
    throw error;
  }
};

/**
 * Verifica el estado de un pago
 * @param {string} pagoId - ID del pago
 * @returns {Promise<Object>}
 */
export const checkPaymentStatus = async (pagoId) => {
  try {
    const response = await api.get(`/cliente/pago/${pagoId}/estado`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al verificar estado del pago:', error);
    throw error;
  }
};