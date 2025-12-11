import api from './api';

/**
 * 📍 SERVICIO DE DIRECCIONES
 * Maneja todas las operaciones relacionadas con direcciones de entrega
 */

/**
 * Obtiene todas las direcciones de un cliente
 * @param {string} clienteId - ID del cliente
 * @returns {Promise<Array>} Lista de direcciones
 */
export const getAddresses = async (clienteId) => {
  try {
    if (!clienteId) {
      throw new Error('clienteId es requerido');
    }

    console.log('📍 Obteniendo direcciones para cliente:', clienteId);
    const response = await api.get(`/cliente/${clienteId}/direcciones`);

    console.log('✅ Respuesta del backend:', response.data);

    // Manejar caso de array vacío
    if (!response.data.direcciones || response.data.direcciones.length === 0) {
      console.log('ℹ️ No hay direcciones registradas');
      return [];
    }

    console.log('✅ Direcciones obtenidas:', response.data.direcciones.length);
    return response.data.direcciones;
  } catch (error) {
    console.error('❌ Error al obtener direcciones:', error.response?.data || error.message);

    // No lanzar error si es 404, devolver array vacío
    if (error.response?.status === 404) {
      return [];
    }

    throw error;
  }
};

/**
 * Crea una nueva dirección para el cliente
 * @param {string} clienteId - ID del cliente
 * @param {Object} addressData - Datos de la dirección
 * @returns {Promise<Object>}
 */
export const createAddress = async (clienteId, addressData) => {
  try {
    if (!clienteId) {
      throw new Error('clienteId es requerido');
    }

    console.log('➕ Creando nueva dirección para cliente:', clienteId);
    console.log('📝 Datos:', addressData);

    const formData = new FormData();
    formData.append('nombre', addressData.nombre);
    formData.append('latitud', addressData.latitud.toString());
    formData.append('longitud', addressData.longitud.toString());
    formData.append('referencia', addressData.referencia || '');
    formData.append('es_principal', addressData.es_principal ? 'true' : 'false');

    const response = await api.post(
      `/cliente/${clienteId}/direccion`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    console.log('✅ Dirección creada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear dirección:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Obtiene una dirección específica por su ID
 */
export const getAddressById = async (direccionId) => {
  try {
    if (!direccionId) throw new Error('direccionId es requerido');

    const response = await api.get(`/cliente/direccion/${direccionId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener dirección:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Actualiza una dirección existente
 */
export const updateAddress = async (direccionId, addressData) => {
  try {
    if (!direccionId) throw new Error('direccionId es requerido');

    console.log('📝 Actualizando dirección:', direccionId);

    const formData = new FormData();
    if (addressData.nombre) formData.append('nombre', addressData.nombre);
    if (addressData.latitud) formData.append('latitud', addressData.latitud.toString());
    if (addressData.longitud) formData.append('longitud', addressData.longitud.toString());
    if (addressData.referencia !== undefined) formData.append('referencia', addressData.referencia);
    if (addressData.es_principal !== undefined) {
      formData.append('es_principal', addressData.es_principal ? 'true' : 'false');
    }

    const response = await api.put(`/cliente/direccion/${direccionId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('✅ Dirección actualizada');
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar dirección:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Elimina una dirección
 */
export const deleteAddress = async (direccionId) => {
  try {
    if (!direccionId) throw new Error('direccionId es requerido');

    console.log('🗑️ Eliminando dirección:', direccionId);
    const response = await api.delete(`/cliente/direccion/${direccionId}`);

    console.log('✅ Dirección eliminada');
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar dirección:', error.response?.data || error.message);
    throw error;
  }
};
