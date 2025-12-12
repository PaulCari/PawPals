// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si ya hay sesión al cargar la página
  useEffect(() => {
    const storedToken = localStorage.getItem('nutri_token');
    const storedUser = localStorage.getItem('nutri_user');

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Función para registrar Nutricionista
  const registerNutri = async (datos) => {
    try {
      const response = await api.post('/auth/register/nutricionista', datos);
      const { token, usuario } = response.data;

      localStorage.setItem('nutri_token', token);
      localStorage.setItem('nutri_user', JSON.stringify(usuario));
      
      setUser(usuario);
      return { success: true };
    } catch (error) {
      console.error("Register error:", error);
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Error al registrarse.' 
      };
    }
  };

  // Función para Login
  const login = async (correo, contrasena) => {
    try {
      const response = await api.post('/auth/login', { correo, contrasena });
      const { token, usuario } = response.data;

      // 🛡️ SEGURIDAD: Verificar que sea Nutricionista (Rol 3) o Admin (Rol 1)
      if (usuario.rol_id !== 3 && usuario.rol_id !== 1) {
        throw new Error('Acceso denegado. Esta área es exclusiva para nutricionistas.');
      }

      // Guardar en almacenamiento local
      localStorage.setItem('nutri_token', token);
      localStorage.setItem('nutri_user', JSON.stringify(usuario));
      
      setUser(usuario);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: error.response?.data?.detail || error.message || 'Error de conexión' 
      };
    }
  };

  // Función para Logout
  const logout = () => {
    localStorage.removeItem('nutri_token');
    localStorage.removeItem('nutri_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, registerNutri, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);