// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
// 1. IMPORTANTE: Agregamos 'Link' aquí para poder navegar
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, PawPrint } from 'lucide-react';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(correo, contrasena);

    if (result.success) {
      navigate('/'); // Redirigir al Dashboard si es exitoso
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-paw-purple">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-paw-purple/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <PawPrint className="text-paw-purple" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">PawPals Nutri-Panel</h1>
          <p className="text-gray-500 text-sm">Acceso exclusivo para especialistas</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paw-purple focus:border-transparent outline-none transition"
                placeholder="nutri@pawpals.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paw-purple focus:border-transparent outline-none transition"
                placeholder="••••••••"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-paw-orange text-white py-2.5 rounded-lg font-bold hover:bg-orange-500 transition shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* 2. NUEVA SECCIÓN: Enlace al Registro */}
        <div className="mt-6 text-center border-t border-gray-100 pt-4">
          <p className="text-gray-600 text-sm">
            ¿Eres un especialista nuevo?{' '}
            <Link to="/register" className="text-paw-purple font-bold hover:underline hover:text-purple-800 transition">
              Regístrate aquí
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;