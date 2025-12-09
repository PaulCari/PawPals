// frontend/services/petService.js
import api from './api';

/**
 * Registra una nueva mascota para un cliente específico.
 * 
 * @param {string} clienteId - ID del cliente propietario
 * @param {Object} petData - Datos de la mascota
 * @param {string} petData.nombre - Nombre de la mascota
 * @param {string} petData.especie_id - ID de la especie (1 = perro, 2 = gato, etc.)
 * @param {string} petData.raza - Raza de la mascota
 * @param {number} petData.edad - Edad de la mascota en años
 * @param {string} petData.sexo - Sexo: 'M' (macho) o 'H' (hembra)
 * @returns {Promise<Object>} Respuesta del servidor con los datos de la mascota creada
 */
export const createPet = async (clienteId, petData) => {
  try {
    // Crear el FormData para enviar los datos
    const formData = new FormData();
    formData.append('nombre', petData.nombre);
    formData.append('especie_id', petData.especie_id);
    formData.append('raza', petData.raza);
    formData.append('edad', petData.edad.toString());
    formData.append('sexo', petData.sexo);

    // Hacer la petición POST al backend
    const response = await api.post(
      `/cliente/mascotas/${clienteId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('❌ Error al crear la mascota:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Obtiene la lista de especies disponibles.
 * @returns {Promise<Array>} Lista de especies (perro, gato, etc.)
 */
export const getSpecies = async () => {
  try {
    const response = await api.get('/cliente/platos-mascotas/especies');
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener especies:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Obtiene todas las mascotas de un cliente.
 * @param {string} clienteId - ID del cliente
 * @returns {Promise<Array>} Lista de mascotas del cliente
 */
export const getPetsByCliente = async (clienteId) => {
  try {
    const response = await api.get(`/cliente/mascotas/${clienteId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener mascotas:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Obtiene el detalle completo de una mascota.
 * @param {string} mascotaId - ID de la mascota
 * @returns {Promise<Object>} Detalle de la mascota
 */
export const getPetDetail = async (mascotaId) => {
  try {
    const response = await api.get(`/cliente/mascotas/detalle/${mascotaId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener detalle de mascota:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Actualiza los datos de una mascota.
 * @param {string} mascotaId - ID de la mascota
 * @param {Object} updateData - Datos a actualizar
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const updatePet = async (mascotaId, updateData) => {
  try {
    const formData = new FormData();
    if (updateData.nombre) formData.append('nombre', updateData.nombre);
    if (updateData.edad) formData.append('edad', updateData.edad.toString());
    if (updateData.peso) formData.append('peso', updateData.peso.toString());
    if (updateData.raza) formData.append('raza', updateData.raza);
    if (updateData.observaciones) formData.append('observaciones', updateData.observaciones);

    const response = await api.put(`/cliente/mascotas/${mascotaId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar mascota:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Elimina una mascota.
 * @param {string} mascotaId - ID de la mascota
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const deletePet = async (mascotaId) => {
  try {
    const response = await api.delete(`/cliente/mascotas/${mascotaId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar mascota:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Obtiene una lista de razas para una especie específica.
 * @param {string} especieId - El ID de la especie (e.g., '1' para Perro).
 * @returns {Promise<Array<string>>} Una lista de nombres de razas.
 */
export const getBreedsBySpecies = async (especieId) => {
  if (!especieId) return []; // No hacer la llamada si no hay especie seleccionada
  try {
    const response = await api.get(`/cliente/platos-mascotas/especies/${especieId}/razas`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener razas:', error.response?.data || error.message);
    return ["Mestizo"]; // Devolver un valor por defecto en caso de error
  }
};