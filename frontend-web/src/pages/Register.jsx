import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, Award, FileText } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { registerNutri } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '', correo: '', contrasena: '', 
    telefono: '', especialidad: '', colegio_veterinario: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await registerNutri(formData);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border-t-4 border-paw-purple">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Registro de Especialista</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-gray-600">Nombre Completo</label>
                <div className="flex items-center border rounded-lg p-2 mt-1">
                    <User size={18} className="text-gray-400 mr-2"/>
                    <input name="nombre" onChange={handleChange} className="w-full outline-none" required />
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-600">Teléfono</label>
                <div className="flex items-center border rounded-lg p-2 mt-1">
                    <Phone size={18} className="text-gray-400 mr-2"/>
                    <input name="telefono" onChange={handleChange} className="w-full outline-none" required />
                </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600">Correo Electrónico</label>
            <div className="flex items-center border rounded-lg p-2 mt-1">
                <Mail size={18} className="text-gray-400 mr-2"/>
                <input type="email" name="correo" onChange={handleChange} className="w-full outline-none" required />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600">Contraseña</label>
            <div className="flex items-center border rounded-lg p-2 mt-1">
                <Lock size={18} className="text-gray-400 mr-2"/>
                <input type="password" name="contrasena" onChange={handleChange} className="w-full outline-none" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-gray-600">Especialidad</label>
                <div className="flex items-center border rounded-lg p-2 mt-1">
                    <Award size={18} className="text-gray-400 mr-2"/>
                    <input name="especialidad" placeholder="Ej: Canina" onChange={handleChange} className="w-full outline-none" required />
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-600">N° Colegiatura</label>
                <div className="flex items-center border rounded-lg p-2 mt-1">
                    <FileText size={18} className="text-gray-400 mr-2"/>
                    <input name="colegio_veterinario" placeholder="CMV-..." onChange={handleChange} className="w-full outline-none" required />
                </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-paw-orange text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition mt-4">
            Registrarme
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            ¿Ya tienes cuenta? <Link to="/login" className="text-paw-purple font-bold hover:underline">Inicia Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;