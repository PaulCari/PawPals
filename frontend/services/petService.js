import apiClient from './api';

export const createPet = async (petData) => {
  try {
    // Aquí podrías necesitar enviar un token de autenticación en las cabeceras
    // const token = await AsyncStorage.getItem('userToken');
    // const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await apiClient.post('/pets', petData); // Ajusta el endpoint
    return response.data;
  } catch (error) {
    console.error('Error al crear la mascota:', error.response.data);
    throw error;
  }
};