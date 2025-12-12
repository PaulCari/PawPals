import React from 'react';
// 1. Quitamos 'BrowserRouter' de los imports, solo dejamos Routes, Route, Navigate
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

// Componente Dashboard Temporal
const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-paw-purple">Hola, {user?.nombre} 👋</h1>
          <button 
            onClick={logout} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Bienvenido al panel de administración de dietas.</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      {/* 2. YA NO usamos <Router> aquí, porque está en main.jsx */}
      <Routes>
        <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;