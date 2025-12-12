// frontend/services/customOrderService.js

import api from './api';

/**
 * 🎯 SERVICIO DE PEDIDOS PERSONALIZADOS
 * Maneja la creación de pedidos especializados con requisitos nutricionales específicos
 */

/**
 * Crea un pedido personalizado para una mascota
 * @param {string} clienteId - ID del cliente
 * @param {Object} orderData - Datos del pedido personalizado
 * @returns {Promise<Object>}
 */
export const createCustomOrder = async (clienteId, orderData) => {
  try {
    if (!clienteId) {
      throw new Error('clienteId es requerido');
    }

    console.log('📦 Creando pedido personalizado para cliente:', clienteId);
    console.log('📝 Datos del pedido:', orderData);

    // Crear FormData para enviar archivos
    const formData = new FormData();

    // Datos obligatorios
    formData.append('registro_mascota_id', orderData.registro_mascota_id);
    formData.append('frecuencia_cantidad', orderData.frecuencia_cantidad);
    formData.append('objetivo_dieta', orderData.objetivo_dieta);
    formData.append('consulta_nutricionista', orderData.consulta_nutricionista ? 'true' : 'false');

    // Datos opcionales
    if (orderData.indicaciones_adicionales) {
      formData.append('indicaciones_adicionales', orderData.indicaciones_adicionales);
    }

    if (orderData.descripcion_alergias) {
      formData.append('descripcion_alergias', orderData.descripcion_alergias);
    }

    if (orderData.condiciones_salud) {
      // Enviar como JSON string de array de objetos
      const condiciones = orderData.condiciones_salud
        .split(',')
        .map(c => ({ nombre: c.trim() }))
        .filter(c => c.nombre);
      
      if (condiciones.length > 0) {
        formData.append('condiciones_salud', JSON.stringify(condiciones));
      }
    }

    if (orderData.preferencias_alimentarias) {
      // Enviar como JSON string de array de strings
      const preferencias = orderData.preferencias_alimentarias
        .split(',')
        .map(p => p.trim())
        .filter(p => p);
      
      if (preferencias.length > 0) {
        formData.append('preferencias_alimentarias', JSON.stringify(preferencias));
      }
    }

    // Archivos adjuntos
    if (orderData.receta_medica && orderData.receta_medica.uri) {
      const uriParts = orderData.receta_medica.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('receta_medica', {
        uri: orderData.receta_medica.uri,
        name: `receta_${Date.now()}.${fileType}`,
        type: `image/${fileType}`,
      });

      console.log('📄 Receta médica adjunta');
    }

    if (orderData.archivo_adicional && orderData.archivo_adicional.uri) {
      const uriParts = orderData.archivo_adicional.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('archivo_adicional', {
        uri: orderData.archivo_adicional.uri,
        name: `adicional_${Date.now()}.${fileType}`,
        type: `image/${fileType}`,
      });

      console.log('📎 Archivo adicional adjunto');
    }

    // Enviar al backend
    const response = await api.post(
      `/cliente/pedido/especializado/${clienteId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('✅ Pedido personalizado creado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear pedido personalizado:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Obtiene los pedidos personalizados de un cliente
 * @param {string} clienteId - ID del cliente
 * @returns {Promise<Array>}
 */
export const getCustomOrders = async (clienteId) => {
  try {
    if (!clienteId) {
      throw new Error('clienteId es requerido');
    }

    console.log('📋 Obteniendo pedidos personalizados para cliente:', clienteId);

    const response = await api.get(`/cliente/pedido/especializado/${clienteId}`);

    console.log('✅ Pedidos obtenidos:', response.data.total || 0);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener pedidos personalizados:', error.response?.data || error.message);
    
    // Si no hay pedidos, devolver array vacío
    if (error.response?.status === 404) {
      return { total: 0, pedidos_especializados: [] };
    }
    
    throw error;
  }
};

/**
 * Obtiene el detalle de un pedido personalizado
 * @param {string} pedidoId - ID del pedido
 * @returns {Promise<Object>}
 */
export const getCustomOrderDetail = async (pedidoId) => {
  try {
    if (!pedidoId) {
      throw new Error('pedidoId es requerido');
    }

    console.log('🔍 Obteniendo detalle del pedido:', pedidoId);

    const response = await api.get(`/cliente/pedido-especializado/detalle/${pedidoId}`);

    console.log('✅ Detalle obtenido');
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener detalle del pedido:', error.response?.data || error.message);
    throw error;
  }
};